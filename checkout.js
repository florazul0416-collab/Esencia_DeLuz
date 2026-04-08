/* assets/js/checkout.js */

const WHATSAPP_NUMBER_CHECKOUT = "573219494475"; // Mismo número del website
let checkoutCart = JSON.parse(localStorage.getItem('esenciaCart')) || [];
let selectedShippingCost = 15000;
let selectedShippingMethod = "Envío Local";
let selectedPaymentMethod = "Nequi";

document.addEventListener('DOMContentLoaded', () => {
    // Si no hay nada en el carrito, regresar al inicio
    if(checkoutCart.length === 0) {
        window.location.href = "index.html";
        return;
    }
    
    renderCheckoutSummary();
});

function renderCheckoutSummary() {
    const listContainer = document.getElementById('checkout-product-list');
    let html = '';
    let subtotal = 0;

    checkoutCart.forEach(item => {
        const itemTotal = item.price * item.quantity;
        subtotal += itemTotal;
        html += `
            <div class="checkout-product-item">
                <div class="checkout-product-image">
                    <img src="${item.image}" alt="${item.name}">
                    <span class="checkout-product-qty">${item.quantity}</span>
                </div>
                <div class="checkout-product-info">
                    <p class="checkout-product-title">${item.name}</p>
                    <p class="checkout-product-variant">Velas Artesanales</p>
                </div>
                <div class="checkout-product-price">
                    $${itemTotal.toLocaleString('es-CO')}
                </div>
            </div>
        `;
    });

    listContainer.innerHTML = html;

    const total = subtotal + selectedShippingCost;
    
    document.getElementById('checkout-subtotal').textContent = `$${subtotal.toLocaleString('es-CO')}`;
    document.getElementById('checkout-shipping-cost').textContent = selectedShippingCost === 0 ? 'Gratis' : `$${selectedShippingCost.toLocaleString('es-CO')}`;
    document.getElementById('checkout-total').textContent = `${total.toLocaleString('es-CO')}`;
}

function selectShipping(element, cost, method) {
    // UI update
    document.querySelectorAll('.checkout-method-item').forEach(el => {
        el.classList.remove('selected');
        const input = el.querySelector('input[name="shipping"]');
        if (input) input.checked = false;
    });
    element.classList.add('selected');
    element.querySelector('input').checked = true;

    // Logic update
    selectedShippingCost = parseInt(cost);
    selectedShippingMethod = method;
    renderCheckoutSummary();
}

function selectPayment(element, method) {
    // UI update for Payments
    const allPaymentLabels = document.querySelectorAll('input[name="payment"]');
    allPaymentLabels.forEach(el => {
        el.closest('.checkout-method-item').classList.remove('selected');
    });

    element.classList.add('selected');
    element.querySelector('input').checked = true;

    // Logic 
    selectedPaymentMethod = method;
}

async function submitCheckoutOrder() {
    // 1. Validar campos
    const email = document.getElementById('checkout-email').value;
    const firstname = document.getElementById('checkout-firstname').value;
    const lastname = document.getElementById('checkout-lastname').value;
    const cedula = document.getElementById('checkout-cedula').value;
    const address = document.getElementById('checkout-address').value;
    const city = document.getElementById('checkout-city').value;
    const phone = document.getElementById('checkout-phone').value;
    const notes = document.getElementById('checkout-notes').value || "Ninguna";

    if(!email || !firstname || !lastname || !cedula || !address || !city || !phone) {
        alert("Por favor, llena todos los campos obligatorios para el envío.");
        return;
    }

    // 2. Calcular los totales
    let subtotal = 0;
    checkoutCart.forEach(item => subtotal += (item.price * item.quantity));
    const total = subtotal + selectedShippingCost;

    // 3. Intentar descontar stock
    if (typeof window.deductStockOnCheckout === "function") {
        await window.deductStockOnCheckout(checkoutCart);
    }
    
    // 4. Registrar en la base de datos y lanzar Pasarela
    if(typeof apiClient !== "undefined" && typeof apiClient.createOrder === "function") {
        try {
            // Mostrar estado de carga
            const btnSubmit = document.getElementById('btn-submit-order');
            btnSubmit.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Conectando al banco...';
            btnSubmit.disabled = true;

            const orderResponse = await apiClient.createOrder({
                items: checkoutCart,
                total: total,
                shipping: selectedShippingMethod,
                customer: `${firstname} ${lastname}`,
                email: email,
                phone: phone,
                address: `${address}, ${city}`,
                notes: notes
            });
            
            if (orderResponse.orderId) {
                // Generar el pago en Mercado Pago
                const preferenceData = {
                    items: checkoutCart,
                    customer: `${firstname} ${lastname}`,
                    email: email,
                    total: total,
                    shipping: selectedShippingCost,
                    orderId: orderResponse.orderId
                };
                
                // Usando API_BASE_URL (declarado en api-client.js)
                const prefResponse = await fetch(`${API_BASE_URL}/create_preference`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(preferenceData)
                });
                const prefData = await prefResponse.json();
                
                if (prefData.init_point) {
                    // Limpiar carrito exitosamente
                    localStorage.removeItem('esenciaCart');
                    
                    // Redirigir maravillosamente a Mercado Pago
                    window.location.href = prefData.init_point;
                } else {
                    alert("Uy, tuvimos un problema contactando a la pasarela de pagos. Por favor intenta de nuevo.");
                    btnSubmit.innerHTML = 'Finalizar Compra';
                    btnSubmit.disabled = false;
                }
            } else {
                alert("Error creando la orden base. Intenta de nuevo.");
                btnSubmit.innerHTML = 'Finalizar Compra';
                btnSubmit.disabled = false;
            }
        } catch (error) {
            console.error("Error guardando orden:", error);
            alert("Error de red intentando finalizar compra. Intenta más tarde.");
            const btnSubmit = document.getElementById('btn-submit-order');
            btnSubmit.innerHTML = 'Finalizar Compra';
            btnSubmit.disabled = false;
        }
    }
}
