"use strict"

// Hacer admin
function postMakeAdmin(buttonSubmit, divAdmins, usersNumber, noUserMessage) {
    buttonSubmit.on("click", (event) => {
        event.preventDefault();
        let idUser = buttonSubmit.data("iduser");
    
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
                showModal(data, $("#div-modal-response-header"), $("#img-modal-response"), $("#h1-modal-response"), $("#p-modal-response"), $("#button-modal-response-ok"), $("#button-modal-response"));
            },
            error: (jqXHR, statusText, errorThrown) => {
                showModal(jqXHR.responseJSON, $("#div-modal-response-header"), $("#img-modal-response"), $("#h1-modal-response"), $("#p-modal-response"), $("#button-modal-response-ok"), $("#button-modal-response"));
            }
        });
    });
}

// Expulsar
function postBan(buttonSubmit) {
    buttonSubmit.on("click", (event) => {
        event.preventDefault();
        let idUser = buttonSubmit.data("iduser");

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
                $(`#img-icon-${idUser}`).attr("title", "Usuario expulsado");
                $(`#div-info-user-${idUser}`).addClass("bg-riu-res-gray");

                // Mostrar modal
                showModal(data, $("#div-modal-response-header"), $("#img-modal-response"), $("#h1-modal-response"), $("#p-modal-response"), $("#button-modal-response-ok"), $("#button-modal-response"));
            },
            error: (jqXHR, statusText, errorThrown) => {
                showModal(jqXHR.responseJSON, $("#div-modal-response-header"), $("#img-modal-response"), $("#h1-modal-response"), $("#p-modal-response"), $("#button-modal-response-ok"), $("#button-modal-response"));
            }
        });
    });
}

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
                    $(`#img-icon-${idUser}`).attr("title", "Usuario validado");

                    // Cambiar botones
                    let divButtons = $(`#div-buttons-${idUser}`);
                    divButtons.empty();
                    // Botón expulsar
                    divButtons.append($(`<button type="button" class="button-ban button-users bg-riu-red" data-bs-toggle="modal" data-bs-target="#div-modal-ban-${idUser}">Expulsar</button>`));
                    // Insertar modal expulsar
                    divButtons.append($(`<div id="div-modal-ban-${idUser}" aria-labelledby="div-modal-ban-${idUser}" aria-hidden="true" class="modal fade">
                                            <div class="modal-dialog modal-lg modal-dialog-centered">
                                                <div class="modal-content">
                                                    <!-- Header -->
                                                    <div class="modal-header bg-riu-primary">
                                                        <button type="button" class="button-modal-x" data-bs-dismiss="modal" aria-label="Close">
                                                            <svg xmlns="http://www.w3.org/2000/svg" fill="#FFFFFF" height="20" class="bi bi-x-lg" viewBox="0 0 16 16">
                                                                <path d="M2.146 2.854a.5.5 0 1 1 .708-.708L8 7.293l5.146-5.147a.5.5 0 0 1 .708.708L8.707 8l5.147 5.146a.5.5 0 0 1-.708.708L8 8.707l-5.146 5.147a.5.5 0 0 1-.708-.708L7.293 8 2.146 2.854Z"/>
                                                            </svg>
                                                        </button>
                                                    </div>
                                                    <!-- Body: mensaje de confirmación -->
                                                    <div class="modal-body d-flex">
                                                        <p>¿Estás seguro de que quieres expulsar a este usuario? No se puede deshacer esta acción.</p>
                                                    </div>
                                                    <!-- Footer -->
                                                    <div class="modal-footer">
                                                        <form>
                                                            <button type="button" class="button-modal-confirm bg-riu-gray" data-bs-dismiss="modal" >No</button>
                                                            <button id="button-sb-ban-${idUser}" class="button-modal-confirm bg-riu-primary ms-2" data-iduser="${idUser}">Sí</button>
                                                        </form>                                                        
                                                    </div>
                                                </div>
                                            </div>
                                        </div>`));
                    postBan($(`#button-sb-ban-${idUser}`));
                    // Botón hacer admin
                    divButtons.append($(`<button type="button" class="button-make-admin button-users bg-riu-primary-light" data-bs-toggle="modal" data-bs-target="#div-modal-make-admin-${idUser}">Hacer Admin</button>`));
                    // Insertar modal hacer admin
                    divButtons.append($(`<div id="div-modal-make-admin-${idUser}" aria-labelledby="div-modal-make-admin-${idUser}" aria-hidden="true" class="modal fade">
                                            <div class="modal-dialog modal-lg modal-dialog-centered">
                                                <div class="modal-content">
                                                    <!-- Header -->
                                                    <div class="modal-header bg-riu-primary">
                                                        <button type="button" class="button-modal-x" data-bs-dismiss="modal" aria-label="Close">
                                                            <svg xmlns="http://www.w3.org/2000/svg" fill="#FFFFFF" height="20" class="bi bi-x-lg" viewBox="0 0 16 16">
                                                                <path d="M2.146 2.854a.5.5 0 1 1 .708-.708L8 7.293l5.146-5.147a.5.5 0 0 1 .708.708L8.707 8l5.147 5.146a.5.5 0 0 1-.708.708L8 8.707l-5.146 5.147a.5.5 0 0 1-.708-.708L7.293 8 2.146 2.854Z"/>
                                                            </svg>
                                                        </button>
                                                    </div>
                                                    <!-- Body: mensaje de confirmación -->
                                                    <div class="modal-body d-flex">
                                                        <p>¿Estás seguro de que quieres hacer administrador a este usuario? No se puede deshacer esta acción.</p>
                                                    </div>
                                                    <!-- Footer -->
                                                    <div class="modal-footer">
                                                        <form>
                                                            <button type="button" class="button-modal-confirm bg-riu-gray" data-bs-dismiss="modal" >No</button>
                                                            <button id="button-sb-make-admin-${idUser}" class="button-modal-confirm bg-riu-primary ms-2" data-iduser="${idUser}">Sí</button>
                                                        </form>                                                        
                                                    </div>
                                                </div>
                                            </div>
                                        </div>`));
                    postMakeAdmin($(`#button-sb-make-admin-${idUser}`), divAdmins, usersNumber, noUserMessage);

                    // Cambiar info user en el div-info-user para el check de pendientes de validar y ocultar si está activado
                    let divInfo = $(`#div-info-user-${idUser}`);
                    let use = divInfo.data("user");
                    use.validated = 1;
                    divInfo.data("user", use);
                    if (checkboxPending.prop("checked")) {
                        divInfo.hide();
                        if ($(".div-card-user:visible").length === 0) {
                            noUserMessage.show();
                        }
                    }

                    // Mostrar modal
                    showModal(data, $("#div-modal-response-header"), $("#img-modal-response"), $("#h1-modal-response"), $("#p-modal-response"), $("#button-modal-response-ok"), $("#button-modal-response"));
                },
                error: (jqXHR, statusText, errorThrown) => {
                    showModal(jqXHR.responseJSON, $("#div-modal-response-header"), $("#img-modal-response"), $("#h1-modal-response"), $("#p-modal-response"), $("#button-modal-response-ok"), $("#button-modal-response"));
                }
            });
        });
    });

    // POST Hacer admin (AJAX)
    const buttonSubmitMakeAdmin = $("[id^='button-sb-make-admin-']");

    // POST
    buttonSubmitMakeAdmin.each(function(i, btn) {
        let buttonSubmit = $(btn);
        postMakeAdmin(buttonSubmit, divAdmins, usersNumber, noUserMessage);
    });    

    // POST Expulsar (AJAX)
    const buttonSubmitBan = $("[id^='button-sb-ban-']");

    // POST
    buttonSubmitBan.each(function(i, btn) {
        let buttonSubmit = $(btn);
        postBan(buttonSubmit);
    });

     // Al cerrar el modal, quitar el backdrop
     $('#modal-response').on('hidden.bs.modal', function () {
        $('.modal-backdrop').remove();
        $('body').css('overflow', 'auto');
    });

    // Ocultar texto Buscar si pantalla es muy pequeña
    if ($(window).width() <= 450) {
        buttonSearch.html(`<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" class="bi bi-search" viewBox="0 0 16 16">
                                <path d="M11.742 10.344a6.5 6.5 0 1 0-1.397 1.398h-.001c.03.04.062.078.098.115l3.85 3.85a1 1 0 0 0 1.415-1.414l-3.85-3.85a1.007 1.007 0 0 0-.115-.1zM12 6.5a5.5 5.5 0 1 1-11 0 5.5 5.5 0 0 1 11 0z" />
                           </svg>`);
    }


});