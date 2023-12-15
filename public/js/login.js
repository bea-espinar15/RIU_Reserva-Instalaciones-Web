"use strict"

const mailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const error = {};

function validateParams(params, universityMails) {
    // Campos no vacíos
    if(params.mail === "" || params.password === ""){
        error.title = "Campos vacíos";
        error.message = "Asegúrate de rellenar todos los campos.";
        return false;
    }
    // Correo es uno de los disponibles
    else if (!mailRegex.test(params.mail) || !universityMails.includes(params.mail.split("@")[1])){
        error.title = "Correo no válido";
        error.message = "Tu correo no pertenece a una universidad.";
        return false;
    }
    else {
        return true;
    }
}

$(() => {

    
    const formLogin = document.getElementById("form-login");
    const inputMail = $("#input-mail");
    const inputPassword = $("#input-password");
    const submitButton = $("#input-sb-login");

    // Botón del modal respuesta/error
    const buttonModalError = $("#button-modal-error");
    const modalErrorHeader = $("#div-modal-error-header");
    const imgModalError = $("#img-modal-error");
    const modalErrorTitle = $("#h1-modal-error");
    const modalErrorMessage = $("#p-modal-error");    
    const buttonErrorOk = $("#button-modal-error-ok");

    let universityMails;

    // Petición GET (AJAX) para obtener los correos que puede introducir el usuario
    $.ajax({
        method: "GET",
        url: "/correosDisponibles",
        success: (data, statusText, jqXHR) => {
            universityMails = data.universityMails;
        }
    });

    submitButton.on("click", (event) => {
        event.preventDefault();
        let params = {
            mail: inputMail.val(),
            password: inputPassword.val()
        };
        if(validateParams(params, universityMails)){
            formLogin.submit();
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