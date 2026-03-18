/* =============================================
ENVÍO DE FORMULARIO
============================================= */

function enviarFormulario(event){

    event.preventDefault();
    
    // Obtenemos los valores del formulario
    const form = document.getElementById("contact-form");
    const name = form.user_name.value;
    const email = form.user_email.value;
    const message = form.message.value;
    
    // Construimos el enlace mailto
    const destino = "florazul0416@gmail.com";
    const asunto = encodeURIComponent("Nuevo mensaje desde Andre-Esencia_deluz - " + name);
    const cuerpo = encodeURIComponent(
        "Has recibido un nuevo mensaje desde la web:\n\n" +
        "Nombre: " + name + "\n" +
        "Correo: " + email + "\n\n" +
        "Mensaje:\n" + message
    );
    
    // Abrimos el cliente de correo
    window.location.href = `mailto:${destino}?subject=${asunto}&body=${cuerpo}`;
    
    // Opcional: mostrar alerta y limpiar form
    alert("Se abrirá tu cliente de correo (Gmail, Outlook, etc.) para enviar el mensaje con los datos que ingresaste.");
    form.reset();

}
