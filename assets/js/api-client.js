// Detección dinámica de la URL del servidor
const API_BASE_URL = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1' 
    ? 'http://localhost:5000/api'
    : 'https://esencia-backend.onrender.com/api'; // <--- URL de Render actualizada

const apiClient = {
    // 1. Obtener todos los productos
    async getProducts() {
        try {
            // Timeout de 5 segundos para no quedar esperando a Render
            const controller = new AbortController();
            const timeoutId = setTimeout(() => controller.abort(), 5000);

            const response = await fetch(`${API_BASE_URL}/products`, {
                signal: controller.signal
            });
            clearTimeout(timeoutId);

            if (!response.ok) throw new Error('Error al cargar productos');
            return await response.json();
        } catch (error) {
            console.warn('El servidor tardó en responder o no está disponible. Usando inventario local.', error);
            return null;
        }
    },

    // 2. Autenticación: Login
    async login(email, password) {
        try {
            const response = await fetch(`${API_BASE_URL}/login`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password })
            });
            const data = await response.json();
            if (data.token) {
                sessionStorage.setItem('auth_token', data.token);
                sessionStorage.setItem('user_info', JSON.stringify(data.user));
            }
            return data;
        } catch (error) {
            console.error('Login Error:', error);
            return { error: 'No se pudo conectar con el servidor' };
        }
    },

    // 3. Autenticación: Registro
    async register(userData) {
        try {
            const response = await fetch(`${API_BASE_URL}/register`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(userData)
            });
            return await response.json();
        } catch (error) {
            console.error('Register Error:', error);
            return { error: 'Error al registrar usuario' };
        }
    },

    // 4. Crear una Orden
    async createOrder(orderData) {
        try {
            const token = sessionStorage.getItem('auth_token');
            
            // Timeout de 4 segundos para no bloquear la compra si Render está apagado
            const controller = new AbortController();
            const timeoutId = setTimeout(() => controller.abort(), 4000);

            const response = await fetch(`${API_BASE_URL}/orders`, {
                method: 'POST',
                headers: { 
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}` 
                },
                body: JSON.stringify(orderData),
                signal: controller.signal
            });
            clearTimeout(timeoutId);
            
            return await response.json();
        } catch (error) {
            console.error('Order Error (silenciado por timeout o error de red):', error);
            // Retornamos un log falso para no frenar la compra
            return { error: 'No se pudo registrar la orden en vivo, continuando a WhatsApp...' };
        }
    },

    // 5. Actualizar el stock de un producto (Admin)
    async updateProductStock(id, stock) {
        try {
            const token = sessionStorage.getItem('auth_token');
            const response = await fetch(`${API_BASE_URL}/products/${id}`, {
                method: 'PUT',
                headers: { 
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}` 
                },
                body: JSON.stringify({ stock_quantity: stock })
            });
            return await response.json();
        } catch (error) {
            console.error('Update Product Stock Error:', error);
            return { error: 'Error al actualizar inventario' };
        }
    }
};

window.apiClient = apiClient;
