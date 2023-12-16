"use strict"

// Cuando cargue el DOM
$(() => {

    // Obtener elementos
    const inputProfilePic = $("#input-profile-pic");
    const buttonSbChangePass = $("#input-sb-change-pass");

    // [TODO] POST editar foto perfil (AJAX)
    inputProfilePic.on("change", (event) => {
        event.preventDefault();
        $.ajax({
            method: "POST",
            url: "/personal/editarFotoPerfil",
            data: {},
            success: () => {},
            error: (jqXHR, statusText, errorThrown) => {
                showModal(jqXHR.responseJSON, $("#div-modal-error-header"), $("#img-modal-error"), $("#h1-modal-error"), $("#p-modal-error"), $("#button-modal-error-ok"), $("#button-modal-error"));
            }
        });
    });

    // [TODO] POST cambiar contraseña (AJAX)
    buttonSbChangePass.on("click", (event) => {
        event.preventDefault();
        $.ajax({
            method: "POST",
            url: "/personal/cambiarContrasena",
            data: {},
            success: () => {},
            error: (jqXHR, statusText, errorThrown) => {
                showModal(jqXHR.responseJSON, $("#div-modal-error-header"), $("#img-modal-error"), $("#h1-modal-error"), $("#p-modal-error"), $("#button-modal-error-ok"), $("#button-modal-error"));
            }
        });
    });

});