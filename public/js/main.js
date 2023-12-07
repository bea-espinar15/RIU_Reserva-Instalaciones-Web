"use strict"

$(() => {

    const error = $("body").data("error");
    const buttonModalError = $("#button-modal-error");
    const modalErrorTitle = $("#h1-modal-error-title");
    const modalErrorMessage = $("#p-modal-error-message");    

    if (error) {
        // Añadir contenido al modal
        modalErrorTitle.text(error.title);
        modalErrorMessage.text(error.message);
        // Abrir modal
        buttonModalError.click();
    }

});