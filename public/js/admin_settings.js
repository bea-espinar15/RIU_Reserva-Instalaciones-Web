"use strict"

const webRegex = /^(ftp|http|https):\/\/[^ "]+$/;

// Validación Cliente
function validateParams(params) {
    let error = {};
    // Campos no vacíos
    if (params.name === "" || params.address === "" || params.web === ""){
        error.code = 400;
        error.title = "Campos vacíos";
        error.message = "Asegúrate de rellenar todos los campos.";
        return error;
    }
    // Correo es uno de los disponibles
    else if (!webRegex.test(params.web)) {
        error.code = 400;
        error.title = "Dirección web no válida";
        error.message = "La dirección web proporcionada no es una URL válida.";
        return error;
    }
    else {
        return null;
    }
}

// Cuando cargue el DOM
$(() => {
    
    // Obtener elementos
    const formSettings = $("#form-settings");
    const inputName = $("#input-settings-name");
    const inputAddress = $("#input-settings-address");
    const inputWeb = $("#input-settings-web");
    const submitButton = $("#input-sb-settings");

    submitButton.on("click", (event) => {
        event.preventDefault();
        let params = {
            name: inputName.val(),
            address: inputAddress.val(),
            web: inputWeb.val()
        };
        // Validar input
        let error = validateParams(params);
        if (!error){
            formSettings.submit();
        }
        else {
            showModal(error, $("#div-modal-error-header"), $("#img-modal-error"), $("#h1-modal-error"), $("#p-modal-error"), $("#button-modal-error-ok"), $("#button-modal-error"));
        }
    });

});