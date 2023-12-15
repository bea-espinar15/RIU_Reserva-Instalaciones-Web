"use strict"

const error = {};

function validateMessageRead(idMessage) {
    // Campos vacíos
    if(idMessage === ""){
        error.title = "Campos vacíos";
        error.message = "Asegúrate de rellenar todos los campos.";
        return false;
    }
    // Petición no válida
    else if (typeof(idMessage) !== 'number') {
        error.title = "Petición no válida";
        error.message = "No sé qué estabas intentando leer, pero no lo estás haciendo bien!";
        return false;
    }
    else {
        return true;
    }
}

function validateMessage(params) {
    // Campos vacíos
    if(params.message === ""){
        error.title = "Campos vacíos";
        error.message = "Asegúrate de rellenar todos los campos.";
        return false;
    }
    // Petición no válida
    else if (params.mail.includes("@")) {
        error.title = "Usuario no válido";
        error.message = "Recuerda introducir correctamente el correo del usuario al que quieres escribir sólo con la parte que va antes del @.";
        return false;
    }
    else {
        return true;
    }
}

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
    // Botón del modal respuesta/error
    const buttonModalError = $("#button-modal-error");
    const modalErrorHeader = $("#div-modal-error-header");
    const imgModalError = $("#img-modal-error");
    const modalErrorTitle = $("#h1-modal-error");
    const modalErrorMessage = $("#p-modal-error");
    const buttonErrorOk = $("#button-modal-error-ok");

    inboxContainer.show();
    showMessageContainer.hide();
            
    // Cuando se pulsa un correo, se muestran sus detalles
    messages.each(function(i, msg) {
        let divMessage = $(this);
        divMessage.on("click", () => {
            let message = divMessage.data("message");
            // Si no estaba leído, se marca como leído
            if (!message.readDate) {
                // POST marcar mensaje como leído (AJAX)
                if (validateMessageRead(message.id)) {
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
                            titleMessage.text("Detalles del mensaje");
                            userMessage.attr("value",   message.senderUsername);
                            subjectMessage.attr("value",message.subject);
                            textMessage.text(message.message);
                            sbSendButton.attr("value","Responder");
                            if (facultyMessage) { facultyMessage.attr("value", ""); }
                            if (universityMessage) { universityMessage.prop("checked", false); }
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
                                buttonCompose.data("disabled", true);
                                buttonCompose.click();
                            });
                            // Ocultar div correos si la pantalla es pequeña
                            if ($(window).width() <= 768) {
                                inboxContainer.hide();
                            } 
                            // Mostrar div
                            showMessageContainer.show();
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
            }
            else {
                // Mostrar detalles del mensaje
                titleMessage.text("Detalles del mensaje");
                userMessage.attr("value",   message.senderUsername);
                subjectMessage.attr("value",message.subject);
                textMessage.text(message.message);
                sbSendButton.attr("value","Responder");
                if (facultyMessage) { facultyMessage.attr("value", ""); }
                if (universityMessage) { universityMessage.prop("checked", false); }
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
                    buttonCompose.data("disabled", true);
                    buttonCompose.click();
                });
                // Ocultar div correos si la pantalla es pequeña
                if ($(window).width() <= 768) {
                    inboxContainer.hide();
                } 
                // Mostrar div
                showMessageContainer.show();
            }
        });
    });

    // Cuando se pulsa en Redactar, se crea el formulario para enviar
    buttonCompose.on("click", () => {
        // Rellenar contenido del div
        titleMessage.text("Nuevo mensaje");
        userMessage.attr("value", buttonCompose.data("answer"));
        subjectMessage.attr("value","");
        textMessage.text("");
        if (facultyMessage) { facultyMessage.attr("value", ""); }
        if (universityMessage) { universityMessage.prop("checked", false); }
        sbSendButton.attr("value","Enviar");
        // Activar inputs
        userMessage.removeAttr("disabled");
        subjectMessage.removeAttr("disabled");
        textMessage.removeAttr("disabled");
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
            if (validateMessage(params)) {
                $.ajax({
                    method: "POST",
                    url: "/personal/enviarMensaje",
                    data: params,
                    success: (data, statusText, jqXHR) => {
                        // Resetear vista
                        showMessageContainer.hide();
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