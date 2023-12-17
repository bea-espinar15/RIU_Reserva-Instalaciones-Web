"use strict"

// Validación en cliente
const passRegex = /(?=.*[A-Za-z])(?=.*\d).{8,}/;

function validatePasswordParams(params) {
    let error = {};
    
    // Campos no vacíos
    if (params.oldPass === "" || params.newPass === "") {
        error.code = 400;
        error.title = "Campos vacíos";
        error.message = "Asegúrate de rellenar todos los campos.";
        return error;
    }
    // Contraseñas no coinciden
    else if (params.newPass === params.oldPass) {
        error.code = 400;
        error.title = "Contraseña no válida";
        error.message = "La nueva contraseña debe ser distinta a la antigua.";
        return error;
    }
    // Password válida
    else if (!passRegex.test(params.newPass)) {
        error.code = 400;
        error.title = "Contraseña no válida";
        error.message = "La contraseña debe tener al menos 8 caracteres, de los cuales al menos 1 debe ser un número y 1 una letra.";
        return error;
    }    
    else {
        return null;
    }
}

// Cuando cargue el DOM
$(() => {

    // Obtener elementos
    const imgNavProfile = $("#img-nav-profile");
    const imgProfile = $("#img-profile-pic");
    const inputProfilePic = $("#input-profile-pic");
    const inputOldPassword = $("#input-change-pass-old");
    const inputNewPassword = $("#input-change-pass-new");
    const buttonSbChangePass = $("#input-sb-change-pass");

    // POST editar foto perfil (AJAX)
    inputProfilePic.on("change", (event) => {
        event.preventDefault();
        // Obtener foto de perfil
        let formData = new FormData();
        let fileInput = inputProfilePic[0].files[0];
        formData.append("profilePic", fileInput);
        let idUser = inputProfilePic.data("iduser");
        $.ajax({
            method: "POST",
            url: "/personal/editarFotoPerfil",
            data: formData,
            processData: false,
            contentType: false,
            success: (data, statusText, jqXHR) => {
                // Actualizar foto en el nav y en el profile
                if (fileInput) {
                    // Para no usar la imagen que tenías en caché si no volver a pedirla al servidor
                    let timestamp = new Date().getTime();
                    imgProfile.attr("src", `/fotoPerfil/${idUser}?timestamp=${timestamp}`);
                    imgNavProfile.attr("src", `/fotoPerfil/${idUser}?timestamp=${timestamp}`);
                }
                else {
                    imgProfile.attr("src", "/img/default/profile.png");
                    imgNavProfile.attr("src", "/img/default/profile.png");
                }
                showModal(data, $("#div-modal-response-header"), $("#img-modal-response"), $("#h1-modal-response"), $("#p-modal-response"), $("#button-modal-response-ok"), $("#button-modal-response"));
            },
            error: (jqXHR, statusText, errorThrown) => {
                showModal(jqXHR.responseJSON, $("#div-modal-response-header"), $("#img-modal-response"), $("#h1-modal-response"), $("#p-modal-response"), $("#button-modal-response-ok"), $("#button-modal-response"));
            }
        });
    });

    // POST cambiar contraseña (AJAX)
    buttonSbChangePass.on("click", (event) => {
        event.preventDefault();
        let params = {
            oldPass: inputOldPassword.val(),
            newPass: inputNewPassword.val()
        };
        // Validación en cliente
        let error = validatePasswordParams(params);
        if (!error) {
            $.ajax({
                method: "POST",
                url: "/personal/cambiarContrasena",
                data: {
                    oldPass: params.oldPass,
                    newPass: params.newPass
                },
                success: (data, statusText, jqXHR) => {
                    // Borrar campos
                    inputOldPassword.val("");
                    inputNewPassword.val("");
                    // Mostrar modal
                    showModal(data, $("#div-modal-response-header"), $("#img-modal-response"), $("#h1-modal-response"), $("#p-modal-response"), $("#button-modal-response-ok"), $("#button-modal-response"));
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

});