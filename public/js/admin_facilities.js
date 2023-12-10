"use strict"

$(() => {
    const facilitiesContainer = $("#div-facilities-container");
    const showFacilityContainer = $("#div-show-facility");
    const buttonNewFacility = $("#button-new-facility");
    const facilities = $(".div-facility");
    const buttonsSeeMore = $(".button-see-more");
    const buttonBack = $("#button-facility-back");
    const inputSearch = $("#input-search-facility");
    const buttonSearch = $("#button-search");
    const noFacilityMessage = $("#p-no-facilities");
    // Contenido de la instalación
    const nameFacility = $("#input-facility-name");
    const typeFacility = $("#input-facility-type");
    const buttonModalNewType = $("#button-modal-new-type");
    const startHourFacility = $("#input-facility-start-hour");
    const endHourFacility = $("#input-facility-end-hour");
    const resTypeFacility = $("#input-facility-res-type");
    const completeFacility= $("#input-facility-complete");
    const capacityFacility = $("#input-facility-capacity");
    const pictureFacility = $("#input-facility-picture");

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

    // Cargar foto
            
    // Cuando se pulsa una instalación, se muestran sus detalles
    buttonsSeeMore.each(function(i, fac) {
        let divFacility = $(this);
        divFacility.on("click", () => {
            let facility = divFacility.data("facility");
            // Rellenar contenido del div
            nameFacility.attr("value", facility.name);
            typeFacility.val(facility.facilityTypeName);
            startHourFacility.attr("value", facility.startHour);
            endHourFacility.attr("value", facility.endHour);
            resTypeFacility.val(facility.reservationType);
            if (facility.complete) { completeFacility.prop("checked", true); }
            else { completeFacility.prop("checked", false); }
            capacityFacility.attr("value", facility.capacity);
            // Desactivar inputs
            nameFacility.removeAttr("disabled");
            typeFacility.attr("disabled", "true");
            startHourFacility.attr("disabled", "true");
            endHourFacility.attr("disabled", "true");
            resTypeFacility.attr("disabled", "true");
            completeFacility.attr("disabled", "true");
            capacityFacility.attr("disabled", "true");
            // Ocultar div instalaciones si la pantalla es pequeña
            if ($(window).width() <= 768) {
                facilitiesContainer.hide();
            } 
            // Mostrar div
            showFacilityContainer.show();
        });
    });

    // Cuando se pulsa en Nueva, se crea el formulario para crear
    buttonNewFacility.off("click").on("click", () => {
        // Rellenar contenido del div
        nameFacility.attr("value", "");
        typeFacility.attr("value", "");
        startHourFacility.attr("value", "");
        endHourFacility.attr("value", "");
        resTypeFacility.attr("value", "");
        completeFacility.prop("checked", false);
        capacityFacility.attr("value", "");
        // Desactivar inputs
        nameFacility.removeAttr("disabled");
        typeFacility.removeAttr("disabled");
        startHourFacility.removeAttr("disabled");
        endHourFacility.removeAttr("disabled");
        resTypeFacility.removeAttr("disabled");
        completeFacility.removeAttr("disabled");
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
        if (typeFacility.val() === "Nuevo tipo...") {
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

});