"use strict"

$(() => {
    const error = $("body").data("error");
    const buttonModalError = $("#button-modal-error");
    // Parámetros del modal
    const modalErrorHeader = $("#div-modal-error-header");
    const imgModalError = $("#img-modal-error");
    const modalErrorTitle = $("#h1-modal-error");
    const modalErrorMessage = $("#p-modal-error");    
    const buttonErrorOk = $("#button-modal-error-ok");

    if (error) {
        modalErrorTitle.text(error.title);
        modalErrorMessage.text(error.message);
        // Success
        if (error.code === 200) {
            modalErrorHeader.addClass("bg-riu-light-green");
            imgModalError.attr("src","/img/icons/success.png");
            imgModalError.attr("alt","Icono de éxito");
            buttonErrorOk.addClass("bg-riu-green");
        }
        // Error
        else {
            console.log(error.title);
            modalErrorHeader.addClass("bg-riu-light-gray");
            imgModalError.attr("src","/img/icons/error.png");
            imgModalError.attr("alt","Icono de error");
            buttonErrorOk.addClass("bg-riu-red");
        }        
        // Abrir modal
        buttonModalError.click();
    }

    // Logout
    const buttonLogout = $("#a-logout");
    const formLogout = $("#form-logout");
    buttonLogout.on("click", () => {
        formLogout.submit();
    });


});