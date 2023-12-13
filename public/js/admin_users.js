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
            let idUser = buttonVal.data("iduser");
            // Validación en cliente
            if (validateParams(idUser)) {
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
                        divButtons.append($(`<button type="button" class="button-users bg-riu-red" data-bs-toggle="modal" data-bs-target="#div-modal-ban" data-idUser="${idUser}">Banear</button>`));
                        divButtons.append($(`<button type="button" class="button-users bg-riu-primary-light button-make-admin" data-bs-toggle="modal" data-bs-target="#div-modal-make-admin" data-idUser="${idUser}">Hacer Admin</button>`));

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
        let idUser = buttonMake.data("iduser");
        buttonMake.on("click", (event) => {
            buttonSubmitMakeAdmin.data("idUser", idUser);
        });
    });

    buttonSubmitMakeAdmin.on("click", (event) => {
        event.preventDefault();
        let idUser = buttonSubmitMakeAdmin.data("iduser");
        // Validación en cliente
        if (validateParams(idUser)) {
            // Petición POST
            $.ajax({
                method: "POST",
                url: "/admin/hacerAdmin",
                data: {},
                success: () => { },
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