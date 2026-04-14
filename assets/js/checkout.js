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

    // Feedback visual en el botón
    const btnSubmit = document.getElementById('btn-submit-order');
    const originalText = btnSubmit.innerHTML;
    btnSubmit.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Procesando...';
    btnSubmit.disabled = true;
    btnSubmit.style.opacity = '0.7';

    // 2. Calcular los totales
    let subtotal = 0;
    checkoutCart.forEach(item => subtotal += (item.price * item.quantity));
    const total = subtotal + selectedShippingCost;

    // 3. Crear el mensaje de WhatsApp detallado
    let text = `✨ *NUEVO PEDIDO WEB* ✨\n\n`;
    text += `*🛍 DATOS DEL CLIENTE:*\n`;
    text += `- Nombre: ${firstname} ${lastname}\n`;
    text += `- Cédula: ${cedula}\n`;
    text += `- Celular: ${phone}\n`;
    text += `- Correo: ${email}\n\n`;
    
    text += `*📦 DATOS DE ENVÍO:*\n`;
    text += `- Dirección: ${address}\n`;
    text += `- Ciudad: ${city}\n`;
    text += `- Método Seleccionado: ${selectedShippingMethod} ($${selectedShippingCost.toLocaleString('es-CO')})\n\n`;

    text += `*🕯 PRODUCTOS:*\n`;
    checkoutCart.forEach(item => {
        text += `- ${item.quantity}x ${item.name} ($${(item.price * item.quantity).toLocaleString('es-CO')})\n`;
    });

    text += `\n*🧾 DESGLOSE:*\n`;
    text += `- Subtotal: $${subtotal.toLocaleString('es-CO')}\n`;
    text += `- Envío: $${selectedShippingCost.toLocaleString('es-CO')}\n`;
    text += `- *TOTAL: $${total.toLocaleString('es-CO')}*\n\n`;

    text += `*💳 MÉTODO DE PAGO:*\n`;
    text += `- Transferencia a: *${selectedPaymentMethod}*\n\n`;

    text += `*📝 NOTAS DEL CLIENTE:*\n`;
    text += `- ${notes}\n\n`;

    text += `_Te adjunto el comprobante de transferencia a continuación:_`;

    const encodedText = encodeURIComponent(text);
    const whatsappUrl = `https://wa.me/${WHATSAPP_NUMBER_CHECKOUT}?text=${encodedText}`;

    // 4. Intentar descontar stock si tienes esa función en window.deductStockOnCheckout
    if (typeof window.deductStockOnCheckout === "function") {
        await window.deductStockOnCheckout(checkoutCart);
    }
    
    // 5. Registrar en la base de datos (si aplica)
    if(typeof apiClient !== "undefined" && typeof apiClient.createOrder === "function") {
        try {
            await apiClient.createOrder({
                items: checkoutCart,
                total: total,
                shipping: selectedShippingMethod,
                customer: `${firstname} ${lastname}`,
                email: email,
                phone: phone,
                address: `${address}, ${city}`,
                notes: notes
            });
        } catch (error) {
            console.error("Error guardando orden en BD (silenciado para permitir WhatsApp):", error);
        }
    }

    // 6. Limpiar el carrito visual y storage
    localStorage.removeItem('esenciaCart');
    
    // 7. Mostrar Modal de éxito para que envíen el voucher
    const overlay = document.getElementById('checkout-overlay');
    const modal = document.getElementById('checkout-success-modal');
    const wpBtn = document.getElementById('btn-go-whatsapp');

    overlay.style.display = 'block';
    modal.classList.add('open');

    wpBtn.onclick = () => {
        window.open(whatsappUrl, '_blank');
        window.location.href = 'index.html'; // Volver a la página principal
    };
}
