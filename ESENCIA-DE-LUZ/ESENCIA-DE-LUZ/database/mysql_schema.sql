-- Esquema de Base de Datos para Esencia de Luz (MySQL)
-- Versión 1.0

CREATE DATABASE IF NOT EXISTS esencia_de_luz;
USE esencia_de_luz;

-- 1. Tabla de Usuarios
CREATE TABLE IF NOT EXISTS users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
-- 2. Tabla de Perfiles (Información adicional del usuario)
CREATE TABLE IF NOT EXISTS profiles (
    user_id INT PRIMARY KEY,
    full_name VARCHAR(100),
    phone VARCHAR(20),
    address TEXT,
    city VARCHAR(100),
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- 3. Tabla de Productos (Inventario)
CREATE TABLE IF NOT EXISTS products (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    description TEXT,
    price DECIMAL(10, 2) NOT NULL,
    stock_quantity INT DEFAULT 0,
    image_url VARCHAR(255),
    category VARCHAR(50),
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- 4. Tabla de Órdenes
CREATE TABLE IF NOT EXISTS orders (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT,
    total_amount DECIMAL(10, 2) NOT NULL,
    shipping_cost DECIMAL(10, 2) DEFAULT 0,
    shipping_method VARCHAR(50),
    status ENUM('pendiente', 'pagado', 'enviado', 'cancelado') DEFAULT 'pendiente',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL
);

-- 5. Detalle de la Orden
CREATE TABLE IF NOT EXISTS order_items (
    id INT AUTO_INCREMENT PRIMARY KEY,
    order_id INT,
    product_id INT,
    quantity INT NOT NULL,
    unit_price DECIMAL(10, 2) NOT NULL,
    FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE,
    FOREIGN KEY (product_id) REFERENCES products(id)
);

-- Insertar datos iniciales de inventario
INSERT INTO products (name, description, price, stock_quantity, image_url) VALUES
('Velas de Soja', 'Vela artesanal de cera de soja 100% natural', 25000.00, 15, 'assets/img/product-soya.jpg'),
('Velas Decorativas', 'Vela de diseño para interiores', 35000.00, 8, 'assets/img/product-deco.jpg'),
('Velas de Cumpleaños', 'Set de velas premium para celebraciones', 15000.00, 25, 'assets/img/product-birthday.jpg'),
('Velas Aromáticas', 'Esencias relajantes para tu hogar', 28000.00, 12, 'assets/img/product-aroma.jpg'),
('Velas de Té', 'Pack de 12 velas pequeñas de larga duración', 18000.00, 40, 'assets/img/product-tea.jpg'),
('Velas de Colores', 'Velas vibrantes para rituales y decoración', 12000.00, 20, 'assets/img/product-colors.jpg');
