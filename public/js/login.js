"use strict"

const mailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// Validación Cliente
function validateParams(params, universityMails) {
    let error = {};
    // Campos no vacíos
    if (params.mail === "" || params.password === "") {
        error.code = 400;
        error.title = "Campos vacíos";
        error.message = "Asegúrate de rellenar todos los campos.";
        return error;
    }
    // Correo es uno de los disponibles
    else if (!mailRegex.test(params.mail) || !universityMails.includes(params.mail.split("@")[1])){
        error.code = 400;
        error.title = "Correo no válido";
        error.message = "Tu correo no pertenece a una universidad.";
        return error;
    }
    else {
        return null;
    }
}

// Cuando cargue el DOM
$(() => {

    // Obtener elementos
    const formLogin = document.getElementById("form-login");
    const inputMail = $("#input-mail");
    const inputPassword = $("#input-password");
    const submitButton = $("#input-sb-login");

    let universityMails;

    // Petición GET (AJAX) para obtener los correos que puede introducir el usuario
    $.ajax({
        method: "GET",
        url: "/correosDisponibles",
        success: (data, statusText, jqXHR) => {
            universityMails = data.universityMails;
        }
    });

    // POST login
    submitButton.on("click", (event) => {
        event.preventDefault();
        let params = {
            mail: inputMail.val(),
            password: inputPassword.val()
        };
        // Validar
        let error = validateParams(params, universityMails);
        if (!error) {
            formLogin.submit();
        }
        else {
            showModal(error, $("#div-modal-response-header"), $("#img-modal-response"), $("#h1-modal-response"), $("#p-modal-response"), $("#button-modal-response-ok"), $("#button-modal-response"));
        }
    });    
    
});