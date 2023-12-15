"use strict"

const webRegex = /^(ftp|http|https):\/\/[^ "]+$/;

const error = {};

function validateParams(params) {
    // Campos no vacíos
    if(params.name === "" || params.address === "" || params.web === ""){
        error.title = "Campos vacíos";
        error.message = "Asegúrate de rellenar todos los campos.";
        return false;
    }
    // Correo es uno de los disponibles
    else if (!webRegex.test(params.web)){
        error.title = "Dirección web no válida";
        error.message = "La dirección web proporcionada no es una URL válida.";
        return false;
    }
    else {
        return true;
    }
}

$(() => {
    
    const formSettings = $("#form-settings");
    const inputName = $("#input-settings-name");
    const inputAddress = $("#input-settings-address");
    const inputWeb = $("#input-settings-web");
    const submitButton = $("#input-sb-settings");
    // Botón del modal respuesta/error
    const buttonModalError = $("#button-modal-error");
    const modalErrorHeader = $("#div-modal-error-header");
    const imgModalError = $("#img-modal-error");
    const modalErrorTitle = $("#h1-modal-error");
    const modalErrorMessage = $("#p-modal-error");    
    const buttonErrorOk = $("#button-modal-error-ok");

    submitButton.on("click", (event) => {
        event.preventDefault();
        let params = {
            name: inputName.val(),
            address: inputAddress.val(),
            web: inputWeb.val()
        };
        if(validateParams(params)){
            formSettings.submit();
        }
        else {
            modalErrorTitle.text(error.title);
            modalErrorMessage.text(error.message);
            modalErrorHeader.removeClass("bg-riu-light-green");
            modalErrorHeader.addClass("bg-riu-light-gray");
            imgModalError.attr("src", "/img/icons/error.png");
            imgModalError.attr("alt", "Icono de error");
            buttonErrorOk.removeClass("bg-riu-green");
            buttonErrorOk.addClass("bg-riu-red");
            // Mostrarlo
            buttonModalError.click();
        }
    });

});