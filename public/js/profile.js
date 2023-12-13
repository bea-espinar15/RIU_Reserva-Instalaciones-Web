"use strict"

$(() => {

    const inputProfilePic = $("#input-profile-pic");

    // [TODO] POST editar foto perfil (AJAX)
    inputProfilePic.on("change", (event) => {
        event.preventDefault();
        $.ajax({
            method: "POST",
            url: "/personal/editarFotoPerfil",
            data: {},
            success: () => {},
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
    });
    
    const buttonSbChangePass = $("#input-sb-change-pass");
    // Botón del modal respuesta/error
    const buttonModalError = $("#button-modal-error");
    const modalErrorHeader = $("#div-modal-error-header");
    const imgModalError = $("#img-modal-error");
    const modalErrorTitle = $("#h1-modal-error");
    const modalErrorMessage = $("#p-modal-error");
    const buttonErrorOk = $("#button-modal-error-ok");

    // [TODO] POST cambiar contraseña (AJAX)
    buttonSbChangePass.on("click", (event) => {
        event.preventDefault();
        $.ajax({
            method: "POST",
            url: "/personal/cambiarContrasena",
            data: {},
            success: () => {},
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
    });

});