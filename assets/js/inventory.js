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

// Guardamos una referencia global de los productos de la DB
let dbProducts = [];

// Cargar inventario de la API (MySQL)
async function getInventory() {
    try {
        const products = await apiClient.getProducts();
        
        if (products && Array.isArray(products)) {
            dbProducts = products; // Guardamos para tener acceso a los IDs
            const inv = {};
            products.forEach(p => {
                inv[p.name || p.nombre] = p.stock_quantity || p.stock;
            });
            return inv;
        }
    } catch (e) {
        console.warn("Fallo al conectar con el backend, usando local.");
    }

    // Backup: localStorage si la API falla
    const localInv = localStorage.getItem('esenciaInventory');
    return localInv ? JSON.parse(localInv) : DEFAULT_INVENTORY;
}

// Función para guardar TODO el inventario desde el botón del admin
async function saveInventory() {
    const tableBody = document.getElementById('inventory-table-body');
    if (!tableBody) return;

    // Feedback visual
    const btnSave = document.querySelector('.btn-save');
    const originalText = btnSave.innerText;
    btnSave.innerText = "Guardando...";
    btnSave.disabled = true;

    const rows = tableBody.querySelectorAll('tr');
    let successCount = 0;

    for (const row of rows) {
        const productId = row.getAttribute('data-id');
        const input = row.querySelector('.stock-input');
        const newStock = parseInt(input.value);

        if (productId && !isNaN(newStock)) {
            const res = await apiClient.updateProductStock(productId, newStock);
            if (!res.error) successCount++;
        }
    }

    // Actualizar también local para consistencia inmediata
    const inventory = {};
    rows.forEach(row => {
        const name = row.querySelector('strong').innerText;
        const stock = row.querySelector('.stock-input').value;
        inventory[name] = parseInt(stock);
    });
    localStorage.setItem('esenciaInventory', JSON.stringify(inventory));

    btnSave.innerText = originalText;
    btnSave.disabled = false;
    
    showNotification();
    if (typeof window.disableOutofStockButtons === 'function') await window.disableOutofStockButtons();
}

// Función para inicializar la tabla en el panel de admin
window.renderInventoryTable = async function() {
    const tableBody = document.getElementById('inventory-table-body');
    if (!tableBody) return;

    const inventory = await getInventory();
    tableBody.innerHTML = '';

    // Si tenemos productos de DB, usamos esos para tener IDs
    if (dbProducts.length > 0) {
        dbProducts.forEach(p => {
            const name = p.name || p.nombre;
            const stock = p.stock_quantity || 0;
            const id = p.id;
            appendRow(tableBody, name, stock, id);
        });
    } else {
        // Fallback a localStorage (sin IDs)
        for (const [name, stock] of Object.entries(inventory)) {
            appendRow(tableBody, name, stock, null);
        }
    }
};

function appendRow(container, name, stock, id) {
    const row = document.createElement('tr');
    if (id) row.setAttribute('data-id', id);
    
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
                class="stock-input">
        </td>
        <td><span class="status-badge status ${statusClass}">${statusText}</span></td>
    `;
    container.appendChild(row);
}

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
    // Nota: Esto actualiza local. En el backend se debería hacer vía API/Order.
    cartItems.forEach(item => {
        if (inventory[item.name] !== undefined) {
            inventory[item.name] = Math.max(0, inventory[item.name] - item.quantity);
        }
    });
    localStorage.setItem('esenciaInventory', JSON.stringify(inventory));
};

// Función para deshabilitar botones de "Añadir al Carrito" si no hay stock
window.disableOutofStockButtons = async function() {
    const inventory = await getInventory();
    const addButtons = document.querySelectorAll('button[onclick^="addToCart"]'); 
    
    addButtons.forEach(btn => {
        const onclick = btn.getAttribute('onclick');
        if (!onclick) return;

        const match = onclick.match(/'([^']+)'/);
        if (match && match[1]) {
            const productName = match[1];
            if (inventory[productName] === 0) {
                btn.innerHTML = '<i class="fas fa-times"></i> Agotado';
                btn.disabled = true;
                btn.style.opacity = '0.5';
                btn.style.cursor = 'not-allowed';
            } else {
                // No restauramos el HTML original aquí porque podría romper el diseño (ej: "Añadir al Carrito")
                // pero sí habilitamos el botón.
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
