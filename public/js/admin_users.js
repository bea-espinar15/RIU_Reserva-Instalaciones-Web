"use strict"

// Cuando cargue el DOM
$(() => {

    // Obtener elementos
    const users = $(".div-card-user");
    const noUserMessage = $("#p-no-users");
    const inputSearch = $("#input-search-user");
    const buttonSearch = $("#button-search");
    const checkboxPending = $("#input-validation-pending")
    const divAdmins = $(`#div-admins`);

    // Mensaje nº resultados
    let usersNumber = users.length;
    if (usersNumber === 0) {
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
        // Filtrar array
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
            // Filtrar array
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
            // Mensaje nº resultados
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

    buttonsValidate.each(function (i, button) {
        let buttonVal = $(this);
        buttonVal.on("click", (event) => {
            event.preventDefault();
            let idUser = buttonVal.data("iduser");

            // Petición POST
            $.ajax({
                method: "POST",
                url: "/admin/validar",
                data: { idUser: idUser },
                success: (data, statusText, jqXHR) => {
                    // Cambiar icono
                    $(`#img-icon-${idUser}`).attr("src", "/img/icons/accepted.png");

                    // Cambiar botones
                    let divButtons = $(`#div-buttons-${idUser}`);
                    divButtons.empty();
                    divButtons.append($(`<button type="button" class="button-ban button-users bg-riu-red" data-bs-toggle="modal" data-bs-target="#div-modal-ban">Expulsar</button>`));
                    divButtons.append($(`<button type="button" class="button-make-admin button-users bg-riu-primary-light button-make-admin" data-bs-toggle="modal" data-bs-target="#div-modal-make-admin">Hacer Admin</button>`));

                    // Añadir funcionalidad al button expulsar
                    let buttonBan = divButtons.find(".button-ban");
                    buttonBan.on("click", (event) => {
                        buttonSubmitBan.data("iduser", idUser);
                    });

                    // Añadir funcionalidad al button hacer admin
                    let buttonMake = divButtons.find(".button-make-admin");
                    buttonMake.on("click", (event) => {
                        buttonSubmitMakeAdmin.data("iduser", idUser);
                    });

                    // Cambiar info user en el div-info-user para el check de pendientes de validar y ocultar si está activado
                    let divInfo = $(`#div-info-user-${idUser}`);
                    let use = divInfo.data("user");
                    use.validated = 1;
                    divInfo.data("user", use);
                    if (checkboxPending.prop("checked")) {
                        divInfo.hide();
                    }

                    // Mostrar modal
                    showModal(data, $("#div-modal-error-header"), $("#img-modal-error"), $("#h1-modal-error"), $("#p-modal-error"), $("#button-modal-error-ok"), $("#button-modal-error"));
                },
                error: (jqXHR, statusText, errorThrown) => {
                    showModal(jqXHR.responseJSON, $("#div-modal-error-header"), $("#img-modal-error"), $("#h1-modal-error"), $("#p-modal-error"), $("#button-modal-error-ok"), $("#button-modal-error"));
                }
            });
        });
    });

    // POST Hacer admin (AJAX)
    const buttonsMakeAdmin = $(".button-make-admin");
    const buttonSubmitMakeAdmin = $("#button-sb-make-admin");

    // Enviar info del botón para abrir el modal al botón de submit
    buttonsMakeAdmin.each(function (i, button) {
        let buttonMake = $(this);
        let idUser = buttonMake.data("iduser");
        buttonMake.on("click", (event) => {
            buttonSubmitMakeAdmin.data("iduser", idUser);
        });
    });

    // POST
    buttonSubmitMakeAdmin.on("click", (event) => {
        event.preventDefault();
        let idUser = buttonSubmitMakeAdmin.data("iduser");

        // Petición POST
        $.ajax({
            method: "POST",
            url: "/admin/hacerAdmin",
            data: { idUser: idUser },
            success: (data, statusText, jqXHR) => {
                // Añadir lista administradores
                let imgSrc = $(`#img-user-${data.user.id}`).attr("src");
                let universityMail = $("#div-container").data("unimail");

                divAdmins.append($(`<div class="div-card-general div-card-admin d-flex d-flex align-items-center">
                                            <div class="div-card-info d-flex">
                                                <!-- Foto de perfil -->
                                                <img src="${imgSrc}" alt="Foto de perfil" width="70" height="70" class="img-profile-pic">
                                                <!-- Info del admin -->
                                                <div class="div-admin-info d-flex align-items-center justify-content-between w-100">
                                                    <div class="d-flex flex-column">
                                                        <h2>
                                                            ${data.user.name} 
                                                            ${data.user.lastname1} 
                                                            ${data.user.lastname2}
                                                        </h2>
                                                        <p>${data.user.mail}@${universityMail}</p>
                                                    </div>
                                                    <!-- Facultad -->
                                                    <p class="p-admin-faculty">${data.user.facultyName}</p>
                                                </div>
                                            </div>
                                        </div>`));

                // Eliminar lista de usuarios
                $(`#div-info-user-${data.user.id}`).remove();

                // Mensaje nº resultados
                usersNumber--;
                if (usersNumber === 0) {
                    noUserMessage.show();
                }

                // Mostrar modal
                showModal(data, $("#div-modal-error-header"), $("#img-modal-error"), $("#h1-modal-error"), $("#p-modal-error"), $("#button-modal-error-ok"), $("#button-modal-error"));
            },
            error: (jqXHR, statusText, errorThrown) => {
                showModal(jqXHR.responseJSON, $("#div-modal-error-header"), $("#img-modal-error"), $("#h1-modal-error"), $("#p-modal-error"), $("#button-modal-error-ok"), $("#button-modal-error"));
            }
        });
    });

    // POST Expulsar (AJAX)
    const buttonsBan = $(".button-ban");
    const buttonSubmitBan = $("#button-sb-ban");

    // Enviar info del botón para abrir el modal al botón de submit
    buttonsBan.each(function (i, button) {
        let buttonBane = $(this);
        let idUser = buttonBane.data("iduser");
        buttonBane.on("click", (event) => {
            buttonSubmitBan.data("iduser", idUser);
        });
    });

    // POST
    buttonSubmitBan.on("click", (event) => {
        event.preventDefault();
        let idUser = buttonSubmitBan.data("iduser");

        // Petición POST
        $.ajax({
            method: "POST",
            url: "/admin/expulsar",
            data: { idUser: idUser },
            success: (data, statusText, jqXHR) => {
                // Ocultar botones
                $(`#div-buttons-${idUser}`).empty();

                // Cambiar icono y fondo
                $(`#img-icon-${idUser}`).attr("src", "/img/icons/banned.png");
                $(`#div-info-user-${idUser}`).addClass("bg-riu-res-gray");

                // Mostrar modal
                showModal(data, $("#div-modal-error-header"), $("#img-modal-error"), $("#h1-modal-error"), $("#p-modal-error"), $("#button-modal-error-ok"), $("#button-modal-error"));
            },
            error: (jqXHR, statusText, errorThrown) => {
                showModal(jqXHR.responseJSON, $("#div-modal-error-header"), $("#img-modal-error"), $("#h1-modal-error"), $("#p-modal-error"), $("#button-modal-error-ok"), $("#button-modal-error"));
            }
        });
    });

});