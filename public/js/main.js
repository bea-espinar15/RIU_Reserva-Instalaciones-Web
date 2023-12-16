"use strict"

// Mostrar el modal con respuesta/error
function showModal(response, header, img, title, message, button, modal) {
    // Título y mensaje
    title.text(response.title);
    message.text(response.message);
    // Success
    if (response.code === 200) {
        // Crear modal
        header.removeClass("bg-riu-light-gray");
        header.addClass("bg-riu-light-green");
        img.attr("src", "/img/icons/success.png");
        img.attr("alt", "Icono de éxito");
        button.removeClass("bg-riu-red");
        button.addClass("bg-riu-green");
    }
    // Error
    else {
        title.text(response.title);
        message.text(response.message);
        header.removeClass("bg-riu-light-green");
        header.addClass("bg-riu-light-gray");
        img.attr("src", "/img/icons/error.png");
        img.attr("alt", "Icono de error");
        button.removeClass("bg-riu-green");
        button.addClass("bg-riu-red");
    }
    // Abrir modal
    modal.click();
}

// Cuando cargue el DOM
$(() => {

    // Comprobar al cargar la página si hay un mensaje que mostrar
    const error = $("body").data("error");

    if (error) {
        showModal(error, $("#div-modal-error-header"), $("#img-modal-error"), $("#h1-modal-error"), $("#p-modal-error"), $("#button-modal-error-ok"), $("#button-modal-error"));
    }

    // Logout
    const buttonLogout = $("#a-logout");
    const formLogout = $("#form-logout");
    buttonLogout.on("click", () => {
        formLogout.submit();
    });

});