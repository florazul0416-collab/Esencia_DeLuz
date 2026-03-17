/* assets/js/cart.js */
const WHATSAPP_NUMBER_CART = "573219494475";

let cart = JSON.parse(localStorage.getItem('esenciaCart')) || [];

async function sanitizeCartWithInventory() {
    const inv = await window.getInventory(); 
    let modified = false;

    for (let i = cart.length - 1; i >= 0; i--) {
        const item = cart[i];
        const stock = inv[item.name] !== undefined ? inv[item.name] : 10;
        if (item.quantity > stock) {
            item.quantity = stock;
            modified = true;
        }
        if (item.quantity <= 0) {
            cart.splice(i, 1);
            modified = true;
        }
    }

    if (modified) {
        localStorage.setItem('esenciaCart', JSON.stringify(cart));
    }
}

// Sincronizar inmediatamente al cargar el script
sanitizeCartWithInventory();

async function saveCart() {
    localStorage.setItem('esenciaCart', JSON.stringify(cart));
    updateCartIcon();
    await renderCart();
}

async function addToCart(name, price, image) {
    // 1. Verificar inventario disponible global (ahora asíncrono)
    const inv = await window.getInventory();
    const stockAvailable = inv[name] !== undefined ? inv[name] : 10;
    
    const existingItem = cart.find(item => item.name === name);
    const currentQtyInCart = existingItem ? existingItem.quantity : 0;

    if (stockAvailable <= 0) {
        alert(`¡Lo sentimos! La vela ${name} se encuentra agotada temporalmente.`);
        return;
    }

    if (currentQtyInCart + 1 > stockAvailable) {
        alert(`¡Lo sentimos! Solo nos quedan ${stockAvailable} unidades de la vela ${name}.`);
        return;
    }

    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({ name, price, image, quantity: 1 });
    }
    await saveCart();
    openCart();
}

async function removeFromCart(index) {
    cart.splice(index, 1);
    await saveCart();
}

async function updateQuantity(index, change) {
    const item = cart[index];
    
    // Verificar stock si está sumando
    if (change > 0) {
        const inv = await window.getInventory();
        const stockAvailable = inv[item.name] !== undefined ? inv[item.name] : 10;
        
        if (item.quantity + change > stockAvailable) {
            alert(`Solo nos quedan ${stockAvailable} unidades de la vela ${item.name}.`);
            return;
        }
    }

    if (item.quantity + change > 0) {
        item.quantity += change;
    } else if (item.quantity + change === 0) {
        await removeFromCart(index);
        return;
    }
    await saveCart();
}

function toggleCart() {
    const drawer = document.getElementById('cart-drawer');
    if (drawer && drawer.classList.contains('open')) {
        closeCart();
    } else {
        openCart();
    }
}

async function openCart() {
    const drawer = document.getElementById('cart-drawer');
    const overlay = document.getElementById('cart-overlay');
    if(drawer) drawer.classList.add('open');
    if(overlay) overlay.classList.add('open');
    await renderCart();
}

function closeCart() {
    const drawer = document.getElementById('cart-drawer');
    const overlay = document.getElementById('cart-overlay');
    if(drawer) drawer.classList.remove('open');
    if(overlay) overlay.classList.remove('open');
}

function updateCartIcon() {
    const counts = document.querySelectorAll('.cart-count');
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    counts.forEach(c => {
        c.textContent = totalItems;
        if(totalItems > 0) {
            c.style.display = 'flex';
        } else {
            c.style.display = 'none';
        }
    });
}

async function renderCart() {
    const cartItemsContainer = document.getElementById('cart-items-container');
    const cartTotalElement = document.getElementById('cart-total-price');
    
    if (!cartItemsContainer || !cartTotalElement) return;

    // Volver a sanitizar por si cambió en otra pestaña
    await sanitizeCartWithInventory();
    
    if (cart.length === 0) {
        cartItemsContainer.innerHTML = '<p class="empty-cart-msg">Tu carrito está vacío.</p>';
        cartTotalElement.textContent = '$0';
        return;
    }

    let html = '';
    let total = 0;

    cart.forEach((item, index) => {
        const itemTotal = item.price * item.quantity;
        total += itemTotal;
        html += `
            <div class="cart-item">
                <img src="${item.image}" alt="${item.name}" class="cart-item-img">
                <div class="cart-item-details">
                    <h4>${item.name}</h4>
                    <p class="cart-item-price">$${item.price.toLocaleString('es-CO')}</p>
                    <div class="cart-item-quantity">
                        <button onclick="updateQuantity(${index}, -1)"><i class="fas fa-minus"></i></button>
                        <span>${item.quantity}</span>
                        <button onclick="updateQuantity(${index}, 1)"><i class="fas fa-plus"></i></button>
                    </div>
                </div>
                <button class="cart-item-remove" onclick="removeFromCart(${index})">
                    <i class="fas fa-trash"></i>
                </button>
            </div>
        `;
    });

    const shippingSelect = document.getElementById('shipping-select');
    let shippingCost = 0;
    if (shippingSelect) {
        shippingCost = parseInt(shippingSelect.value) || 0;
    }
    const finalTotal = total + shippingCost;

    cartItemsContainer.innerHTML = html;
    cartTotalElement.textContent = '$' + finalTotal.toLocaleString('es-CO');
}

async function checkoutWhatsApp() {
    if (cart.length === 0) return;

    let text = "Hola Esencia de Luz, me gustaría realizar el siguiente pedido:\n\n";
    let subtotal = 0;

    cart.forEach(item => {
        const itemTotal = item.price * item.quantity;
        subtotal += itemTotal;
        text += `- ${item.quantity}x Vela ${item.name} ($${itemTotal.toLocaleString('es-CO')})\n`;
    });

    const shippingSelect = document.getElementById('shipping-select');
    let shippingCost = 0;
    let shippingName = "Recogida en taller";
    if (shippingSelect) {
        shippingCost = parseInt(shippingSelect.value) || 0;
        shippingName = shippingSelect.options[shippingSelect.selectedIndex].text;
    }

    const total = subtotal + shippingCost;
    
    text += `\n*Método de Envío:* ${shippingName}`;
    text += `\n*Total a pagar: $${total.toLocaleString('es-CO')}*\n\n`;
    text += "Deseo realizar la transferencia a Nequi o Bancolombia, quedo atento(a) a las instrucciones.";

    // 1. Registrar orden en el Backend (MySQL)
    const orderResult = await apiClient.createOrder({
        items: cart,
        total: total,
        shipping: shippingName
    });

    if (orderResult.error) {
        console.warn('No se pudo registrar la orden en la base de datos:', orderResult.error);
    }

    // 2. Descontar del inventario local (para actualización inmediata UI)
    if (typeof window.deductStockOnCheckout === "function") {
        await window.deductStockOnCheckout(cart);
    }

    // 3. Vaciar el carrito después de la compra
    cart = [];
    await saveCart();
    closeCart();

    const url = `https://wa.me/${WHATSAPP_NUMBER_CART}?text=${encodeURIComponent(text)}`;
    
    // 4. Mostrar Modal de Éxito
    const successModal = document.getElementById('success-modal');
    if (successModal) {
        successModal.classList.add('open');
        // Almacenar URL para el botón del modal
        window.pendingWhatsAppUrl = url;
    } else {
        // Fallback si no hay modal
        window.open(url, '_blank');
    }
}

function closeSuccessAndGo() {
    const successModal = document.getElementById('success-modal');
    if (successModal) successModal.classList.remove('open');
    if (window.pendingWhatsAppUrl) {
        window.open(window.pendingWhatsAppUrl, '_blank');
        window.pendingWhatsAppUrl = null;
    }
}

// Initialize on load
document.addEventListener('DOMContentLoaded', () => {
    updateCartIcon();
    
    if (typeof window.disableOutofStockButtons === 'function') {
        window.disableOutofStockButtons();
    }
    
    const overlay = document.getElementById('cart-overlay');
    if(overlay) {
        overlay.addEventListener('click', closeCart);
    }
});
