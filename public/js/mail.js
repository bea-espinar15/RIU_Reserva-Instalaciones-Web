"use strict"

$(() => {

    const buttonCompose = $("#button-compose");
    const formMail = $("#div-show-mail");
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
    const universityMessage= $("#input-university");
    const sbSendButton = $("#input-sb-mail");

    inboxContainer.show();
    showMessageContainer.hide();
            
    // Cuando se pulsa un correo, se muestran sus detalles
    messages.each(function(i, msg) {
        let divMessage = $(this);
        divMessage.on("click", () => {
            let message = divMessage.data("message");
            // Rellenar contenido del div
            titleMessage.text("Detalles del mensaje");
            userMessage.attr("value",   message.senderUsername);
            subjectMessage.attr("value",message.subject);
            textMessage.text(message.message);
            sbSendButton.attr("value","Responder");
            // Desactivar inputs
            userMessage.attr("disabled", "true");
            subjectMessage.attr("disabled", "true");
            textMessage.attr("disabled", "true");
            if (facultyMessage) { facultyMessage.attr("disabled", "true"); }
            if (universityMessage) { universityMessage.attr("disabled", "true"); }
            // Cambiar funcionalidad del botón
            sbSendButton.off("click").on("click", (event) => {
                event.preventDefault();
                buttonCompose.data("answer", message.senderUsername);
                buttonCompose.click();
            });
            // Ocultar div correos si la pantalla es pequeña
            if ($(window).width() <= 768) {
                inboxContainer.hide();
            } 
            // Mostrar div
            showMessageContainer.show();
        });
    });

    // Cuando se pulsa en Redactar, se crea el formulario para enviar
    buttonCompose.on("click", () => {
        // Rellenar contenido del div
        titleMessage.text("Nuevo mensaje");
        userMessage.attr("value", buttonCompose.data("answer"));
        subjectMessage.attr("value","");
        textMessage.text("");
        sbSendButton.attr("value","Enviar");
        // Activar inputs
        userMessage.removeAttr("disabled");
        subjectMessage.removeAttr("disabled");
        textMessage.removeAttr("disabled");
        if (facultyMessage) { facultyMessage.removeAttr("disabled"); }
        if (universityMessage) { universityMessage.removeAttr("disabled"); }
        // Actualizar data botón
        buttonCompose.data("answer", "");
        // Actualizar funcionalidad
        sbSendButton.off("click").on("click", (event) => {
            event.preventDefault();
            formMail.submit();
        });
        // Ocultar div correos si la pantalla es pequeña
        if ($(window).width() <= 768) {
            inboxContainer.hide();
        }
        // Mostrar div
        showMessageContainer.show();
    });

    // Botón atrás
    buttonBack.off("click").on("click", (event) => {
        event.preventDefault();
        inboxContainer.show();
        showMessageContainer.hide();
    });
});