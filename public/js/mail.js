"use strict"

// Mostrar detalles
function showRightDiv(window, inboxContainer, showMessageContainer) {
    // Ocultar div correos si la pantalla es pequeña
    if (window.width() <= 768) {
        inboxContainer.hide();
    }
    // Mostrar div
    showMessageContainer.show();
}

// Rellenar contenido del mensaje
function showMailDetails(message, facultyMessage, universityMessage, title, user, subject, text, sbSendButton, buttonCompose, inboxContainer, showMessageContainer) {
    // Mostrar detalles del mensaje
    title.text("Detalles del mensaje");
    user.val(message.senderUsername);
    subject.val(message.subject);
    text.val(message.message);
    sbSendButton.val("Responder");
    if (facultyMessage) { facultyMessage.val(""); }
    if (universityMessage) { universityMessage.prop("checked", false); }
    // Desactivar inputs
    user.attr("disabled", "true");
    subject.attr("disabled", "true");
    text.attr("disabled", "true");
    if (facultyMessage) { facultyMessage.attr("disabled", "true"); }
    if (universityMessage) { universityMessage.attr("disabled", "true"); }
    // Cambiar funcionalidad del botón
    sbSendButton.off("click").on("click", (event) => {
        event.preventDefault();
        buttonCompose.data("answer", message.senderUsername);
        buttonCompose.data("disabled", true);
        buttonCompose.click();
    });
    // Mostrar/ocultar divs
    showRightDiv($(window), inboxContainer, showMessageContainer);
}

// Rellenar nuevo mensaje
function showMailCompose(facultyMessage, universityMessage, title, user, subject, text, sbSendButton, buttonCompose) {
    // Rellenar contenido del div
    title.text("Nuevo mensaje");
    user.val(buttonCompose.data("answer"));
    subject.val("");
    text.val("");
    if (facultyMessage) { facultyMessage.val(""); }
    if (universityMessage) { universityMessage.prop("checked", false); }
    sbSendButton.attr("value", "Enviar");
    // Activar inputs
    user.removeAttr("disabled");
    subject.removeAttr("disabled");
    text.removeAttr("disabled");
    if (facultyMessage) {
        if (!buttonCompose.data("disabled")) {
            facultyMessage.removeAttr("disabled");
        }
    }
    if (universityMessage) {
        if (!buttonCompose.data("disabled")) {
            universityMessage.removeAttr("disabled");
        }
    }
    // Actualizar data botón
    buttonCompose.data("answer", "");
    buttonCompose.data("disabled", false);
}

// Validación Cliente
function validateMessage(params) {
    let error = {};
    // Mensaje vacío
    if (params.message === "") {
        error.code = 400;
        error.title = "Mensaje vacío";
        error.message = "El mensaje que quieres mandar no puede estar vacío.";
        return error;
    }
    // Correo vacío
    if (params.mail === "") {
        error.code = 400;
        error.title = "Correo vacío";
        error.message = "Recuerda indicar a quién quieres mandar el correo, escribiendo sólo con la parte que va antes del @.";
        return error;
    }
    // Petición no válida
    else if (params.mail.includes("@")) {
        error.code = 400;
        error.title = "Usuario no válido";
        error.message = "Recuerda introducir correctamente el correo del usuario al que quieres escribir sólo con la parte que va antes del @.";
        return error;
    }
    else {
        return null;
    }
}

function validateMessageAdmin(params) {
    let error = {};
    // Mensaje vacío
    if (params.message === "") {
        error.code = 400;
        error.title = "Mensaje vacío";
        error.message = "El mensaje que quieres mandar no puede estar vacío.";
        return error;
    }
    // Correo vacío
    if (params.mail === "" && params.faculty === "" && !params.university) {
        error.code = 400;
        error.title = "Destinatario vacío";
        error.message = "Recuerda indicar a quién quieres mandar el correo, eligiendo o bien un usuario, o una facultad o la organización completa.";
        return error;
    }
    // Petición no válida
    else if (params.mail !== "" && params.mail.includes("@")) {
        error.code = 400;
        error.title = "Usuario no válido";
        error.message = "Recuerda introducir correctamente el correo del usuario al que quieres escribir sólo con la parte que va antes del @.";
        return error;
    }
    else {
        return null;
    }
}

// Cuando cargue el DOM
$(() => {

    // Obtener elementos
    const buttonCompose = $("#button-compose");
    const inboxContainer = $("#div-inbox");
    const showMessageContainer = $("#div-show-mail-container");
    const messages = $(".div-message");
    const buttonBack = $("#button-mail-back");
    // Contenido del mensaje
    const titleMessage = $("#h1-message");
    const userMessage = $("#input-mail-user");
    const subjectMessage = $("#input-mail-subject");
    const textMessage = $("#textarea-mail-message");
    const facultyMessage = $("#input-faculty");
    const universityMessage = $("#input-university");
    const sbSendButton = $("#input-sb-mail");
    const buttonAlertMessage = $("#button-alert-message");

    inboxContainer.show();
    showMessageContainer.hide();

    // Cuando se pulsa un correo, se muestran sus detalles
    messages.each(function (i, msg) {
        let divMessage = $(this);
        divMessage.on("click", () => {
            let message = divMessage.data("message");
            // Si no estaba leído, se marca como leído
            if (!message.readDate) {                
                // POST marcar mensaje como leído (AJAX)
                $.ajax({
                    method: "POST",
                    url: "/personal/marcarLeido",
                    data: {
                        idMessage: message.id
                    },
                    success: (data, statusText, jqXHR) => {
                        // Cambiar apariencia (no negrita y eliminar punto)
                        $(`#h2-sender-${message.id}`).removeClass("font-bold");
                        $(`#p-subject-${message.id}`).removeClass("font-bold");
                        $(`#img-unread-dot-${message.id}`).hide();
                        // Actualizar mensaje
                        let today = new Date();
                        let day = today.getDate();
                        let month = today.getMonth() + 1;
                        let year = today.getFullYear();
                        if (day < 10) { day = '0' + day; }
                        if (month < 10) { month = '0' + month; }
                        message.readDate = day + '/' + month + '/' + year;
                        divMessage.data("message", message);
                        // Mostrar detalles del mensaje
                        showMailDetails(message, facultyMessage, universityMessage, titleMessage, userMessage, subjectMessage, textMessage, sbSendButton, buttonCompose, inboxContainer, showMessageContainer);
                    },
                    error: (jqXHR, statusText, errorThrown) => {
                        showModal(jqXHR.responseJSON, $("#div-modal-response-header"), $("#img-modal-response"), $("#h1-modal-response"), $("#p-modal-response"), $("#button-modal-response-ok"), $("#button-modal-response"));
                    }
                });                
            }
            else {
                // Mostrar detalles del mensaje
                showMailDetails(message, facultyMessage, universityMessage, titleMessage, userMessage, subjectMessage, textMessage, sbSendButton, buttonCompose, inboxContainer, showMessageContainer);
            }
        });
    });

    // Cuando se pulsa en Redactar, se crea el formulario para enviar
    buttonCompose.on("click", () => {
        // Mostrar nuevo mensaje
        showMailCompose(facultyMessage, universityMessage, titleMessage, userMessage, subjectMessage, textMessage, sbSendButton, buttonCompose);
        // Actualizar funcionalidad
        sbSendButton.off("click").on("click", (event) => {
            event.preventDefault();
            // POST enviar mensaje (AJAX)
            let params = {
                mail: userMessage.val(),
                faculty: facultyMessage.val(),
                university: universityMessage.prop("checked"),
                subject: subjectMessage.val(),
                message: textMessage.val()
            }
            // Validar
            let error;
            if (facultyMessage) { // eres admin
                error = validateMessageAdmin(params);
            }
            else {
                error = validateMessage(params);
            }            
            if (!error) {
                $.ajax({
                    method: "POST",
                    url: "/personal/enviarMensaje",
                    data: params,
                    success: (data, statusText, jqXHR) => {
                        // Resetear vista
                        showMessageContainer.hide();
                        // Mostrar alerta toast
                        buttonAlertMessage.click();
                    },
                    error: (jqXHR, statusText, errorThrown) => {
                        showModal(jqXHR.responseJSON, $("#div-modal-response-header"), $("#img-modal-response"), $("#h1-modal-response"), $("#p-modal-response"), $("#button-modal-response-ok"), $("#button-modal-response"));
                    }
                });
            }
            else {
                showModal(error, $("#div-modal-response-header"), $("#img-modal-response"), $("#h1-modal-response"), $("#p-modal-response"), $("#button-modal-response-ok"), $("#button-modal-response"));
            }
        });
        // Mostrar/ocultar divs
        showRightDiv($(window), inboxContainer, showMessageContainer);
    });

    // Si se escribe en un campo (admin) los otros se desactivan
    userMessage.on("change", () => {
        if (userMessage.val() === "") {
            // Activar los otros
            facultyMessage.removeAttr("disabled");
            universityMessage.removeAttr("disabled");
        }
        else {
            // Desactivar los otros
            facultyMessage.attr("disabled", "true");
            universityMessage.attr("disabled", "true");
        }
    });

    facultyMessage.on("change", () => {
        if (facultyMessage.val() === "") {
            // Activar los otros
            userMessage.removeAttr("disabled");
            universityMessage.removeAttr("disabled");
        }
        else {
            // Desactivar los otros
            userMessage.attr("disabled", "true");
            universityMessage.attr("disabled", "true");
        }

    });

    universityMessage.on("change", () => {
        if (!universityMessage.prop("checked")) {
            // Activar los otros
            userMessage.removeAttr("disabled");
            facultyMessage.removeAttr("disabled");
        }
        else {
            // Desactivar los otros
            userMessage.attr("disabled", "true");
            facultyMessage.attr("disabled", "true");
        }
    });
    
    // Toast cuando se envía un mensaje    
    const toastAlertMessage = $("#toast-alert-message");

    const toast = bootstrap.Toast.getOrCreateInstance(toastAlertMessage);
    buttonAlertMessage.on("click", () => {
        toast.show();
    });

    // Botón atrás
    buttonBack.off("click").on("click", (event) => {
        event.preventDefault();
        inboxContainer.show();
        showMessageContainer.hide();
    });
    
});