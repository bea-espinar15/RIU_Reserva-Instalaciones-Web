"use strict"

// [TODO]
function validateParams(params) {
    return true;
}

$(() => {

    const users = $(".div-card-user");
    const noUserMessage = $("#p-no-users");
    const inputSearch = $("#input-search-user");
    const buttonSearch = $("#button-search");
    const checkboxPending = $("#input-validation-pending")

    if (users.length === 0) {
        noUserMessage.show();
    }
    else {
        noUserMessage.hide();
    }

    let isSearching = false;

    // Búsqueda por nombre
    buttonSearch.on("click", (event) => {
        if (checkboxPending.prop("checked")) {
            isSearching = true;
            checkboxPending.click();
        }
        event.preventDefault();
        let anyUser = false;
        let usersArray = users.toArray();
        usersArray.filter((divUse) => {
            let divUser = $(divUse);
            let user = divUser.data("user");
            if ((user.mail).toLowerCase().includes((inputSearch.val()).toLowerCase())) {
                anyUser = true;
                divUser.show();
            }
            else {
                divUser.hide();
            }
        });
        if (!anyUser) {
            noUserMessage.show();
        }
        else {
            noUserMessage.hide();
        }
    });

    // Filtrar pendientes de validar
    checkboxPending.on("change", () => {
        if (!isSearching) {
            inputSearch.val("");
            let anyUser = false;
            let usersArray = users.toArray();
            usersArray.filter((divUse) => {
                let divUser = $(divUse);
                let user = divUser.data("user");
                if (!checkboxPending.prop("checked")) {
                    anyUser = true;
                    divUser.show();
                }
                else {
                    if (!user.validated) {
                        anyUser = true;
                        divUser.show();
                    }
                    else {
                        divUser.hide();
                    }
                }
            });
            if (!anyUser) {
                noUserMessage.show();
            }
            else {
                noUserMessage.hide();
            }
        }
        else {
            isSearching = false;
        }
    });

    // POST Validar (AJAX)
    const buttonsValidate = $(".button-sb-validate");

    // Botón del modal respuesta/error
    const buttonModalError = $("#button-modal-error");
    const modalErrorHeader = $("#div-modal-error-header");
    const imgModalError = $("#img-modal-error");
    const modalErrorTitle = $("#h1-modal-error");
    const modalErrorMessage = $("#p-modal-error");
    const buttonErrorOk = $("#button-modal-error-ok");

    buttonsValidate.each(function (i, button) {
        let buttonVal = $(this);
        buttonVal.on("click", (event) => {
            event.preventDefault();
            let user = buttonVal.data("user");
            // Validación en cliente
            if (validateParams(user)) {
                // Petición POST
                $.ajax({
                    method: "POST",
                    url: "/admin/validar",
                    data: { idUser: user.id },
                    success: (data, statusText, jqXHR) => {
                        // Cambiar icono
                        $(`#img-icon-${user.id}`).attr("src", "/img/icons/accepted.png");

                        // Cambiar botones
                        let divButtons = $(`#div-buttons-${user.id}`);
                        divButtons.empty();
                        divButtons.append($(`<button type="button" class="button-users bg-riu-red" data-bs-toggle="modal" data-bs-target="#div-modal-ban" data-idUser="${user.id}">Expulsar</button>`));
                        divButtons.append($(`<button type="button" class="button-users bg-riu-primary-light button-make-admin" data-bs-toggle="modal" data-bs-target="#div-modal-make-admin">Hacer Admin</button>`));

                        // Añadir data user
                        let buttonMake = divButtons.find('button').last();
                        buttonMake.data("user", JSON.stringify(user));

                        // Añadir funcionalidad al button hacer admin
                        let user2 = JSON.parse(buttonMake.data("user"));
                        buttonMake.on("click", (event) => {
                            buttonSubmitMakeAdmin.data("user", user2);
                        });

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
        });
    });

    // [TODO] POST Hacer admin (AJAX)
    const buttonsMakeAdmin = $(".button-make-admin");
    const buttonSubmitMakeAdmin = $("#button-sb-make-admin");

    buttonsMakeAdmin.each(function (i, button) {
        let buttonMake = $(this);
        let user = buttonMake.data("user");
        buttonMake.on("click", (event) => {
            buttonSubmitMakeAdmin.data("user", user);
        });
    });

    buttonSubmitMakeAdmin.on("click", (event) => {
        event.preventDefault();
        let user = buttonSubmitMakeAdmin.data("user");
        // Validación en cliente
        if (validateParams(user)) {
            // Petición POST
            $.ajax({
                method: "POST",
                url: "/admin/hacerAdmin",
                data: { idUser: user.id },
                success: (data, statusText, jqXHR) => {
                    // Eliminar lista de usuarios
                    $(`#div-info-user-${user.id}`).hide();
                    
                    // Añadir lista administradores
                    let imgNewAdmin = $(`#img-user-${user.id}`);
                    let imgSrc = imgNewAdmin.attr("src");
                    let universityMail = imgNewAdmin.data("unimail");

                    let divAdmins = $(`#div-admins`);
                    divAdmins.append($(`<div class="div-card-general div-card-admin d-flex d-flex align-items-center">
                                            <div class="div-card-info d-flex">
                                                <!-- Foto de perfil -->
                                                <img src="${imgSrc}" alt="Foto de perfil" width="70" height="70" class="img-profile-pic">
                                                <!-- Info del admin -->
                                                <div class="div-admin-info d-flex align-items-center justify-content-between w-100">
                                                    <div class="d-flex flex-column">
                                                        <h2>
                                                            ${user.name} 
                                                            ${user.lastname1} 
                                                            ${user.lastname2}
                                                        </h2>
                                                        <p>${user.mail}@${universityMail}</p>
                                                    </div>
                                                    <!-- Facultad -->
                                                    <p class="p-admin-faculty">${user.facultyName}</p>
                                                </div>
                                            </div>
                                        </div>`));
                    
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
    });

    // [TODO] POST Expulsar (AJAX)
    const buttonsBan = $(".button-ban");
    const buttonSubmitBan = $("#button-sb-ban");

    buttonsBan.each(function (i, button) {
        let buttonBane = $(this);
        let idUser = buttonBane.data("iduser");
        buttonBane.on("click", (event) => {
            buttonSubmitBan.data("idUser", idUser);
        });
    });

    buttonSubmitBan.on("click", (event) => {
        event.preventDefault();
        let idUser = buttonSubmitBan.data("iduser");
        // Validación en cliente
        if (validateParams(idUser)) {
            // Petición POST
            $.ajax({
                method: "POST",
                url: "/admin/expulsar",
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
        }
    });

});