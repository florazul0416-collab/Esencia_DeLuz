/* assets/js/inventory.js */

// Inventario inicial si no existe en localStorage
const DEFAULT_INVENTORY = {
    "Velas de Soja": 15,
    "Velas Decorativas": 8,
    "Velas de Cumpleaños": 25,
    "Velas Aromáticas": 12,
    "Velas de Té": 40,
    "Velas de Colores": 20
};

// Cargar inventario de la API (MySQL)
async function getInventory() {
    // Intentar obtener de la API primero
    const products = await apiClient.getProducts();
    
    // Si la API devuelve una lista de productos (formato [ {nombre, stock}, ... ])
    // convertimos al formato que espera el resto del script { "Nombre": Stock }
    if (products && Array.isArray(products)) {
        const inv = {};
        products.forEach(p => {
            inv[p.nombre || p.name] = p.stock;
        });
        return inv;
    }

    // Backup: localStorage si la API falla
    const localInv = localStorage.getItem('esenciaInventory');
    return localInv ? JSON.parse(localInv) : DEFAULT_INVENTORY;
}

// Guardar inventario (Nota: los cambios del admin deberían ir a la API)
async function saveInventory(inv) {
    localStorage.setItem('esenciaInventory', JSON.stringify(inv));
    // En una integración completa, aquí llamaríamos a apiClient para actualizar MySQL
    
    if (typeof window.renderInventoryTable === 'function') await window.renderInventoryTable();
    if (typeof window.disableOutofStockButtons === 'function') await window.disableOutofStockButtons();
}

// Función para inicializar la tabla en el panel de admin
window.renderInventoryTable = async function() {
    const tableBody = document.getElementById('inventory-table-body');
    if (!tableBody) return;

    const inventory = await getInventory();
    tableBody.innerHTML = '';

    for (const [name, stock] of Object.entries(inventory)) {
        const row = document.createElement('tr');
        
        let statusClass = 'status-ok';
        let statusText = 'En Stock';
        
        if (stock === 0) {
            statusClass = 'status-out';
            statusText = 'Agotado';
        } else if (stock < 5) {
            statusClass = 'status-low';
            statusText = 'Poco Stock';
        }

        row.innerHTML = `
            <td><strong>${name}</strong></td>
            <td>
                <input type="number" value="${stock}" min="0" 
                    onchange="updateStockValue('${name}', this.value)" 
                    class="stock-input">
            </td>
            <td><span class="status-badge ${statusClass}">${statusText}</span></td>
        `;
        tableBody.appendChild(row);
    }
};

// Función para actualizar un valor individual desde el admin
window.updateStockValue = async function(name, newValue) {
    const inventory = await getInventory();
    inventory[name] = parseInt(newValue) || 0;
    await saveInventory(inventory);
    showNotification();
};

function showNotification() {
    const notif = document.getElementById('notification');
    if (!notif) return;
    notif.classList.add('show');
    setTimeout(() => notif.classList.remove('show'), 3000);
}

// Función para verificar stock antes de añadir al carrito
window.checkStock = async function(productName, requestedQty) {
    const inventory = await getInventory();
    const available = inventory[productName] !== undefined ? inventory[productName] : 10;
    return available >= requestedQty;
};

// Función para descontar stock tras una compra (WhatsApp checkout)
window.deductStockOnCheckout = async function(cartItems) {
    const inventory = await getInventory();
    cartItems.forEach(item => {
        if (inventory[item.name] !== undefined) {
            inventory[item.name] = Math.max(0, inventory[item.name] - item.quantity);
        }
    });
    await saveInventory(inventory);
};

// Función para deshabilitar botones de "Añadir al Carrito" si no hay stock
window.disableOutofStockButtons = async function() {
    const inventory = await getInventory();
    const addButtons = document.querySelectorAll('button[onclick^="addToCart"]'); 
    
    addButtons.forEach(btn => {
        const match = btn.getAttribute('onclick').match(/'([^']+)'/);
        if (match && match[1]) {
            const productName = match[1];
            if (inventory[productName] === 0) {
                btn.innerHTML = '<i class="fas fa-times"></i> Agotado';
                btn.disabled = true;
                btn.style.opacity = '0.5';
                btn.style.cursor = 'not-allowed';
            } else {
                btn.disabled = false;
                btn.style.opacity = '1';
                btn.style.cursor = 'pointer';
            }
        }
    });
};

// Inicializar al cargar el DOM
document.addEventListener('DOMContentLoaded', () => {
    if (document.getElementById('inventory-table-body')) {
        window.renderInventoryTable();
    }
    window.disableOutofStockButtons();
});
