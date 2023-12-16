"use strict"

$(() => {

    const users = $(".div-card-user");
    const noUserMessage = $("#p-no-users");
    const inputSearch = $("#input-search-user");
    const buttonSearch = $("#button-search");
    const checkboxPending = $("#input-validation-pending")
    const divAdmins = $(`#div-admins`);

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

                    //Cambiar info user en el div-info-user para el check de pendientes de validar y ocultar si está activado
                    let divInfo = $(`#div-info-user-${idUser}`);
                    let use = divInfo.data("user");
                    use.validated = 1;
                    divInfo.data("user", use);
                    if (checkboxPending.prop("checked")) {
                        divInfo.hide();
                    }

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
        });
    });

    // POST Hacer admin (AJAX)
    const buttonsMakeAdmin = $(".button-make-admin");
    const buttonSubmitMakeAdmin = $("#button-sb-make-admin");

    buttonsMakeAdmin.each(function (i, button) {
        let buttonMake = $(this);
        let idUser = buttonMake.data("iduser");
        buttonMake.on("click", (event) => {
            buttonSubmitMakeAdmin.data("iduser", idUser);
        });
    });

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


                usersNumber--;
                if (usersNumber === 0) {
                    noUserMessage.show();
                }

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
    });

    // POST Expulsar (AJAX)
    const buttonsBan = $(".button-ban");
    const buttonSubmitBan = $("#button-sb-ban");

    buttonsBan.each(function (i, button) {
        let buttonBane = $(this);
        let idUser = buttonBane.data("iduser");
        buttonBane.on("click", (event) => {
            buttonSubmitBan.data("iduser", idUser);
        });
    });

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
    });

});