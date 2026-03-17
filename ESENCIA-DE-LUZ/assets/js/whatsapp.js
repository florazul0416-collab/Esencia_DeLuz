/* ===================================================
   FUNCION PARA GENERAR MENSAJE DE WHATSAPP
   =================================================== */

function comprarProducto(nombreProducto){

    const numero = "573219494475";

    const mensaje =
    "Hola, quiero comprar la vela " + nombreProducto;

    const url =
    "https://wa.me/" + numero +
    "?text=" + encodeURIComponent(mensaje);

    window.open(url, "_blank");

}