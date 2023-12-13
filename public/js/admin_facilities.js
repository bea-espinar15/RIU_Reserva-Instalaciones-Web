"use strict"

$(() => {
    const facilitiesContainer = $("#div-facilities-container");
    const showFacilityContainer = $("#div-show-facility");
    const buttonNewFacility = $("#button-new-facility");
    const facilitiesTable = $("#div-results");
    const facilities = $(".div-facility");
    const buttonsSeeMore = $(".button-see-more");
    const buttonBack = $("#button-facility-back");
    const inputSearch = $("#input-search-facility");
    const buttonSearch = $("#button-search");
    const noFacilityMessage = $("#p-no-facilities");
    // Contenido de la instalación
    const facilityPic = $("#img-facility-pic");
    const nameFacility = $("#input-facility-name");
    const typeFacility = $("#input-facility-type");
    const buttonModalNewType = $("#button-modal-new-type");
    const startHourFacility = $("#input-facility-start-hour");
    const endHourFacility = $("#input-facility-end-hour");
    const resTypeFacility = $("#input-facility-res-type");
    const capacityFacility = $("#input-facility-capacity");
    const pictureFacility = $("#input-facility-picture");
    const buttonSbFacility = $("#input-sb-facility");

    facilitiesContainer.show();
    showFacilityContainer.hide();

    // Número de resultados
    if (facilities.length === 0) {
        noFacilityMessage.text("No hay ningún resultado que coincida.");
    }
    else if (facilities.length === 1) {
        noFacilityMessage.text(`Ver ${facilities.length} resultado`);
    }
    else {
        noFacilityMessage.text(`Ver ${facilities.length} resultados`);
    }

    // Cuando se pulsa una instalación, se muestran sus detalles
    facilitiesTable.on('click', '.button-see-more', function () {
        let divFacility = $(this);
        let facility = divFacility.data("facility");
        let typeHasPic = divFacility.data("typehaspic");
        // Rellenar contenido del div
        console.log("hola");
        console.log(facility);
        if (facility.hasPic) { facilityPic.attr("src", `/fotoInstalacion/${facility.id}`); }
        else if (typeHasPic) { facilityPic.attr("src", `/fotoTipoInstalacion/${facility.idType}`); }
        else { facilityPic.attr("src", "/img/default/facility.png"); }
        nameFacility.val(facility.name);
        typeFacility.val(facility.facilityTypeName);
        startHourFacility.val(facility.startHour);
        endHourFacility.val(facility.endHour);
        resTypeFacility.val(facility.reservationType);
        capacityFacility.val(facility.capacity);
        buttonSbFacility.data("new", false);
        // Desactivar inputs
        nameFacility.removeAttr("disabled");
        typeFacility.attr("disabled", "true");
        startHourFacility.attr("disabled", "true");
        endHourFacility.attr("disabled", "true");
        resTypeFacility.attr("disabled", "true");
        capacityFacility.attr("disabled", "true");
        // Ocultar div instalaciones si la pantalla es pequeña
        if ($(window).width() <= 768) {
            facilitiesContainer.hide();
        }
        // Mostrar div
        showFacilityContainer.show();
    });

    // Cuando se pulsa en Nueva, se crea el formulario para crear
    buttonNewFacility.off("click").on("click", () => {
        // Rellenar contenido del div
        nameFacility.val("");
        typeFacility.val("");
        startHourFacility.val("");
        endHourFacility.val("");
        resTypeFacility.val("Individual");
        capacityFacility.val("");
        facilityPic.attr("src", "/img/default/facility.png");
        buttonSbFacility.data("new", true);
        // Desactivar inputs
        nameFacility.removeAttr("disabled");
        typeFacility.removeAttr("disabled");
        startHourFacility.removeAttr("disabled");
        endHourFacility.removeAttr("disabled");
        resTypeFacility.removeAttr("disabled");
        capacityFacility.removeAttr("disabled");
        // Ocultar div instalaciones si la pantalla es pequeña
        if ($(window).width() <= 768) {
            facilitiesContainer.hide();
        }
        // Mostrar div
        showFacilityContainer.show();
    });

     // Botón atrás
    buttonBack.off("click").on("click", (event) => {
        event.preventDefault();
        facilitiesContainer.show();
        showFacilityContainer.hide();
    });

    // Al seleccionar un nuevo tipo, se abre el modal:
    typeFacility.on("change", () => {
        if (typeFacility.val() === "") {
            buttonModalNewType.click();
        }        
    });

    // Búsqueda por nombre
    buttonSearch.on("click", (event) => {
        event.preventDefault();
        let anyFacility = 0;
        let facilitiesArray = facilities.toArray();
        facilitiesArray.filter((divFac) => {
            let divFacility = $(divFac);
            let facility = divFacility.data("facility");
            if ((facility.name).toLowerCase().includes((inputSearch.val()).toLowerCase())) {
                anyFacility++;
                divFacility.show();
            }
            else {
                divFacility.hide();
            }            
        });
        
        if (anyFacility === 0) {
            noFacilityMessage.text("No hay ningún resultado que coincida.");
        }
        else if (anyFacility === 1) {
            noFacilityMessage.text(`Ver ${anyFacility} resultado`);
        }
        else {
            noFacilityMessage.text(`Ver ${anyFacility} resultados`);
        }   
    });

    // Botón del modal respuesta/error
    const buttonModalError = $("#button-modal-error");
    const modalErrorHeader = $("#div-modal-error-header");
    const imgModalError = $("#img-modal-error");
    const modalErrorTitle = $("#h1-modal-error");
    const modalErrorMessage = $("#p-modal-error");
    const buttonErrorOk = $("#button-modal-error-ok");

    // POST crear instalación (AJAX)   
    buttonSbFacility.on("click", (event) => {
        event.preventDefault();
        if (buttonSbFacility.data("new")) {
            let params = {
                name: nameFacility.val(),
                startHour: startHourFacility.val(),
                endHour: endHourFacility.val(),
                reservationType: resTypeFacility.val(),
                capacity: capacityFacility.val(),
                facilityType: typeFacility.val(),
                facilityPic: pictureFacility.val()
            }
            $.ajax({
                method: "POST",
                url: "/admin/crearInstalacion",
                data: params,
                success: (data, statusText, jqXHR) => {
                    const facilityData = JSON.stringify(data.facility);
                    const typeHasPicData = JSON.stringify(data.facility.typeHasPic);

                    // Añadir instalación a la lista
                    const divNewFacility = $(`<div class="div-facility justify-content-between" data-facility="${facilityData}">
                                                <div class="d-flex flex-column">
                                                    <h2>${data.facility.name}</h2>
                                                    <p>${data.facility.typeName}</p>
                                                </div>
                                                <button type="button" class="button-see-more bg-riu-primary-dark align-items-end" data-facility="${facilityData}" data-typehaspic="${typeHasPicData}">Ver más</button>
                                            </div>`);
                    facilitiesTable.append(divNewFacility);
                    // Ocultar el formulario
                    showFacilityContainer.hide();
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
        // [TODO] POST editar instalación (AJAX)
        else {
            $.ajax({
                method: "POST",
                url: "/admin/editarInstalacion",
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

    // [TODO] POST crear nuevo tipo (AJAX)
    const buttonSbNewType = $("#button-sb-new-type");

    buttonSbNewType.on("click", (event) => {
        event.preventDefault();
        $.ajax({
            method: "POST",
            url: "/admin/crearTipo",
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