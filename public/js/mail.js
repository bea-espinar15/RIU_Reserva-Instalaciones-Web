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
    user.attr("value", message.senderUsername);
    subject.attr("value", message.subject);
    text.text(message.message);
    sbSendButton.attr("value", "Responder");
    if (facultyMessage) { facultyMessage.attr("value", ""); }
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
    user.attr("value", buttonCompose.data("answer"));
    subject.attr("value", "");
    text.text("");
    if (facultyMessage) { facultyMessage.attr("value", ""); }
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
    let error;
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
                        // Mostrar detalles del mensaje
                        showMailDetails(message, facultyMessage, universityMessage, titleMessage, userMessage, subjectMessage, textMessage, sbSendButton, buttonCompose, inboxContainer, showMessageContainer);
                    },
                    error: (jqXHR, statusText, errorThrown) => {
                        showModal(jqXHR.responseJSON, $("#div-modal-error-header"), $("#img-modal-error"), $("#h1-modal-error"), $("#p-modal-error"), $("#button-modal-error-ok"), $("#button-modal-error"));
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
            let error = validateMessage(params);
            if (!error) {
                $.ajax({
                    method: "POST",
                    url: "/personal/enviarMensaje",
                    data: params,
                    success: (data, statusText, jqXHR) => {
                        // Resetear vista
                        showMessageContainer.hide();
                        // Mostrar modal
                        showModal(data, $("#div-modal-error-header"), $("#img-modal-error"), $("#h1-modal-error"), $("#p-modal-error"), $("#button-modal-error-ok"), $("#button-modal-error"));
                    },
                    error: (jqXHR, statusText, errorThrown) => {
                        showModal(jqXHR.responseJSON, $("#div-modal-error-header"), $("#img-modal-error"), $("#h1-modal-error"), $("#p-modal-error"), $("#button-modal-error-ok"), $("#button-modal-error"));
                    }
                });
            }
            else {
                showModal(error, $("#div-modal-error-header"), $("#img-modal-error"), $("#h1-modal-error"), $("#p-modal-error"), $("#button-modal-error-ok"), $("#button-modal-error"));
            }
        });
        // Mostrar/ocultar divs
        showRightDiv($(window), inboxContainer, showMessageContainer);
    });

    // Botón atrás
    buttonBack.off("click").on("click", (event) => {
        event.preventDefault();
        inboxContainer.show();
        showMessageContainer.hide();
    });
    
});