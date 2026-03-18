/* 
   server.js - Estructura Sugerida para el Backend de Esencia de Luz
   Este archivo es una propuesta educativa del servidor para conectar con MySQL.
*/

const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '.env') });

const app = express();
app.use(cors());
app.use(express.json());

// 1. Configuración de conexión con soporte para Producción (SSL)
const db = mysql.createPool({
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'esencia_de_luz',
    port: process.env.DB_PORT || 3306,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,
    multipleStatements: true,
    ssl: process.env.DB_SSL === 'true' ? { rejectUnauthorized: false } : null
});

db.getConnection((err, connection) => {
    if (err) {
        console.error('Error conectando a MySQL:', err);
        return;
    }
    console.log('--- Conectado exitosamente al servidor MySQL (Pool) ---');

    // 2. Crear tablas si no existen
    const schema = `
        CREATE TABLE IF NOT EXISTS users (
            id INT AUTO_INCREMENT PRIMARY KEY,
            email VARCHAR(255) UNIQUE NOT NULL,
            password_hash VARCHAR(255) NOT NULL,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        );
        CREATE TABLE IF NOT EXISTS profiles (
            user_id INT PRIMARY KEY,
            full_name VARCHAR(100), phone VARCHAR(20), address TEXT, city VARCHAR(100),
            FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
        );
        CREATE TABLE IF NOT EXISTS products (
            id INT AUTO_INCREMENT PRIMARY KEY,
            name VARCHAR(100) NOT NULL, description TEXT, price DECIMAL(10, 2) NOT NULL,
            stock_quantity INT DEFAULT 0, image_url VARCHAR(255), category VARCHAR(50),
            updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
        );
        CREATE TABLE IF NOT EXISTS orders (
            id INT AUTO_INCREMENT PRIMARY KEY,
            user_id INT, total_amount DECIMAL(10, 2) NOT NULL, status ENUM('pendiente', 'pagado', 'enviado', 'cancelado') DEFAULT 'pendiente',
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL
        );
        CREATE TABLE IF NOT EXISTS order_items (
            id INT AUTO_INCREMENT PRIMARY KEY,
            order_id INT, product_id INT, quantity INT NOT NULL, unit_price DECIMAL(10, 2) NOT NULL,
            FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE,
            FOREIGN KEY (product_id) REFERENCES products(id)
        );
    `;

    connection.query(schema, (err) => {
        if (err) console.error('Error creando tablas:', err);
        else {
            console.log('¡Tablas verificadas y listas en la nube!');

            // 3. Insertar datos iniciales si la tabla de productos está vacía
            connection.query('SELECT COUNT(*) as count FROM products', (err, results) => {
                if (!err && results[0].count === 0) {
                    const initialProducts = `
                        INSERT INTO products (name, description, price, stock_quantity, image_url) VALUES
                        ('Colección Inspiración', 'Vela especial Día de la Mujer - Fuerza y Valor', 35000.00, 10, 'assets/images/Coleccion Mujer.jpeg'),
                        ('Vela Propósito Blue', 'Vela de intención con aroma a Eucalipto', 32000.00, 12, 'assets/images/Coleccion Velas Proposito.jpeg'),
                        ('Vela Propósito Pink', 'Vela de intención con aroma a Rosas', 32000.00, 12, 'assets/images/Coleccion Velas Proposito Rosa.jpeg'),
                        ('Vela Abundancia', 'Aroma Canela y Prosperidad', 30000.00, 8, 'assets/images/Coleccion vela Abundancia Atraccion y Dulzura.jpeg'),
                        ('Wax Melts Paz Interior', 'Corazones aromáticos de Lavanda Relajante', 18000.00, 20, 'assets/images/Wax Melts Calma.jpeg'),
                        ('Wax Melts Maracuyá', 'Corazones aromáticos frutales y energizantes', 18000.00, 15, 'assets/images/Wax Melts Candle Juice Maracuya.jpeg');
                    `;
                    connection.query(initialProducts, (err) => {
                        if (!err) console.log('¡Productos iniciales cargados en la base de datos!');
                    });
                }
                connection.release(); // Muy importante liberar la conexión inicial
            });
        }
    });
});

// --- RUTAS DE EJEMPLO ---

// 1. Registro de Usuario
app.post('/api/register', async (req, res) => {
    const { email, password, full_name } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);

    db.query('INSERT INTO users (email, password_hash) VALUES (?, ?)', [email, hashedPassword], (err, result) => {
        if (err) return res.status(500).json({ error: err.message });

        const userId = result.insertId;
        db.query('INSERT INTO profiles (user_id, full_name) VALUES (?, ?)', [userId, full_name], (err) => {
            if (err) return res.status(500).json({ error: err.message });
            res.json({ message: 'Usuario registrado con éxito' });
        });
    });
});

// 2. Login de Usuario
app.post('/api/login', (req, res) => {
    const { email, password } = req.body;

    db.query('SELECT * FROM users WHERE email = ?', [email], async (err, results) => {
        if (err || results.length === 0) return res.status(401).json({ error: 'Usuario no encontrado' });

        const user = results[0];
        const isMatch = await bcrypt.compare(password, user.password_hash);

        if (!isMatch) return res.status(401).json({ error: 'Contraseña incorrecta' });

        const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET || 'secret_key', { expiresIn: '1h' });
        res.json({ token, user: { id: user.id, email: user.email } });
    });
});

// 3. Obtener Inventario
app.get('/api/products', (req, res) => {
    db.query('SELECT * FROM products', (err, results) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(results);
    });
});

// 4. Crear una Orden
app.post('/api/orders', (req, res) => {
    const { items, total, shipping } = req.body;
    // En un sistema real, sacaríamos el user_id del token JWT
    const userId = null;

    db.query('INSERT INTO orders (user_id, total_amount, shipping_method, status) VALUES (?, ?, ?, ?)',
        [userId, total, shipping, 'pendiente'], (err, result) => {
            if (err) return res.status(500).json({ error: err.message });

            const orderId = result.insertId;
            const values = items.map(item => [orderId, null, item.quantity, item.price]);

            // Nota: Idealmente buscaríamos el product_id por nombre aquí, pero para simplificar:
            db.query('INSERT INTO order_items (order_id, product_id, quantity, unit_price) VALUES ?', [values], (err) => {
                if (err) return res.status(500).json({ error: err.message });
                res.json({ message: 'Orden registrada con éxito', orderId });
            });
        });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Servidor ejecutándose en http://localhost:${PORT}`);
});
