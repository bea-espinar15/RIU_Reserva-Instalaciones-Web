"use strict"

const mailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const passwordRegex = /(?=.*[A-Za-z])(?=.*\d).{8,}/;
const error = {};

function validateParams(params, universityMails) {
    // Campos no vacíos
    if(params.name === "" || params.lastname1 === "" || params.lastname2 === "" || params.mail === "" || params.password === "" || params.faculty === ""){
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
    // Contraseña válida
    else if (!passwordRegex.test(params.password)) {
        error.title = "Contraseña no válida";
        error.message = "La contraseña debe tener al menos 8 caracteres, de los cuales al menos 1 debe ser un número y 1 una letra.";
        return false;
    }
    else {
        return true;
    }
}

$(() => {

    let universityMails;

    // Petición GET (AJAX) para obtener los correos que puede introducir el usuario
    $.ajax({
        method: "GET",
        url: "/correosDisponibles",
        success: (data, statusText, jqXHR) => {
            universityMails = data.universityMails;
        }
    });

    // Cuando se cambia el correo, si es uno de los válidos se traen las facultades
    const inputMail = $("#input-mail");
    const inputFaculty = $("#input-faculty");

    inputMail.on("change", () => {
        let mail = inputMail.val();
        // Si es un correo
        if (mailRegex.test(mail)) {
            // Si es uno de los válidos
            let mailAfterAt = mail.split("@")[1];
            if (universityMails.includes(mailAfterAt)) {
                // Petición GET
                $.ajax({
                    method: "GET",
                    url: "/facultades",
                    data: {
                        mail: mailAfterAt
                    },
                    success: (data, statusText, jqXHR) => {
                        // Resetear combo
                        inputFaculty.empty();
                        // Meter facultades obtenidas
                        (data.faculties).forEach((fac) => {
                            inputFaculty.append(`<option value="${fac.name}">${fac.name}</option>`);
                        });
                    }
                });
            }
        }
        else {
            // Resetear combo
            inputFaculty.empty();
            inputFaculty.append("<option value=\"null\">Introduce tu correo</option>");
        }
    });

    // POST Registro (AJAX)
    const buttonSignUp = $("#input-sb-sign-up");
    const inputName = $("#input-name");
    const inputLastname1 = $("#input-lastname-1");
    const inputLastname2 = $("#input-lastname-2");
    const inputPassword = $("#input-password");

    // Botón del modal respuesta/error
    const buttonModalError = $("#button-modal-error");
    const modalErrorHeader = $("#div-modal-error-header");
    const imgModalError = $("#img-modal-error");
    const modalErrorTitle = $("#h1-modal-error");
    const modalErrorMessage = $("#p-modal-error");    
    const buttonErrorOk = $("#button-modal-error-ok");

    buttonSignUp.on("click", (event) => {
        event.preventDefault();
        let params = {
            name: inputName.val(),
            lastname1: inputLastname1.val(),
            lastname2: inputLastname2.val(),
            mail: inputMail.val(),
            password: inputPassword.val(),
            faculty: inputFaculty.val()
        };
        // Validación en cliente
        if (validateParams(params, universityMails)) {
            // Petición POST
            $.ajax({
                method: "POST",
                url: "/registro",
                data: params,
                success: (data, statusText, jqXHR) => {
                    // Crear modal
                    modalErrorTitle.text(data.title);
                    modalErrorMessage.text(data.message);
                    modalErrorHeader.removeClass("bg-riu-light-gray");
                    modalErrorHeader.addClass("bg-riu-light-green");
                    imgModalError.attr("src", "/img/icons/success.png");
                    imgModalError.attr("alt", "Icono de éxito");
                    buttonErrorOk.removeClass("bg-riu-red");
                    buttonErrorOk.addClass("bg-riu-green");
                    // Mostrarlo
                    buttonModalError.click();
                },
                error: (jqXHR, statusText, errorThrown) => {
                    let error = jqXHR.responseJSON;
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