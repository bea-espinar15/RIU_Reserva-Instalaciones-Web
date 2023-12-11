"use strict"

function generateHours(startHour, endHour) {
    // Convertir a Date 
    let dateStart = new Date(`2000-01-01T${startHour}`);
    let dateEnd = new Date(`2000-01-01T${endHour}`);

    let hours = new Array();

    while (dateStart < dateEnd) {
        // Formatear hora
        let hour = dateStart.toLocaleTimeString('es-ES', {
            hour: '2-digit',
            minute: '2-digit',
            hour12: false
        });
        hours.push(hour);
        dateStart.setHours(dateStart.getHours() + 1);
    }

    return hours;
}

$(() => {

    const facilitiesContainer = $("#div-facilities-container");
    const showFacilityContainer = $("#div-show-facility");
    const facilities = $(".div-facility");
    const buttonsSeeMore = $(".button-see-more");
    const buttonBack = $("#button-facility-back");
    const nPeopleFilter = $("#input-n-people");
    const buttonFilter = $("#button-filter");
    const noFacilityMessage = $("#p-no-facilities");
    // Contenido de la instalación
    const nameFacility = $("#h2-facility-name");
    const warningResType = $("#p-warning-res-type");
    const facilityDate = $("#input-facility-date");
    const hoursTable = $("#div-hours");
    const nPeopleModal = $("input-facility-n-people");
    const buttonReserve = $("#div-modal-reserve");

    facilitiesContainer.show();
    showFacilityContainer.hide();

    // Número de resultados
    if (facilities.length > 0) {
        noFacilityMessage.hide();
    }
    else {
        noFacilityMessage.show();
    }
    
    
    // Cargar foto
            
    // Cuando se pulsa una instalación, se muestran sus detalles
    buttonsSeeMore.each(function(i, fac) {
        let divFacility = $(this);
        divFacility.on("click", () => {
            let facility = divFacility.data("facility");
            // Rellenar contenido del div
            nameFacility.text(facility.name);
            if (!facility.typeRes) { warningResType.show(); }
            else { warningResType.hide(); }
            // Generar horas
            let hours = generateHours(facility.startHour, facility.endHour);
            hoursTable.empty();
            hours.forEach((hour) => {
                hoursTable.append(`<span class="badge bg-riu-gray">${hour}</span>`);
            });
            hoursTable.on("click", ".badge", function() {
                let hour = $(this);
                hoursTable.find("span").removeClass("bg-riu-blue");
                hoursTable.find("span").addClass("bg-riu-gray");
                hour.removeClass("bg-riu-gray");
                hour.addClass("bg-riu-blue");
            });
            // Ocultar div instalaciones si la pantalla es pequeña
            if ($(window).width() <= 768) {
                facilitiesContainer.hide();
            } 
            // Mostrar div
            showFacilityContainer.show();
        });
    });

     // Botón atrás
    buttonBack.off("click").on("click", (event) => {
        event.preventDefault();
        facilitiesContainer.show();
        showFacilityContainer.hide();
    });

    // Al abrir el modal, actualizamos input nPeople:
    buttonReserve.on("click", () => {
        nPeopleModal.val(nPeopleFilter.val());
    });

    // Filtrar por número de aforo
    buttonFilter.on("click", (event) => {
        event.preventDefault();
        let anyFacility = false;
        facilities.each(function(i, fac) {
            let divFacility = $(this);
            let facility = divFacility.data("facility");
            if (facility.capacity >= nPeopleFilter.val()) {
                divFacility.show();
                anyFacility = true;
            }
            else {
                divFacility.hide();
            }
        });
        if (!anyFacility) {
            noFacilityMessage.show();
        } 
        else {
            noFacilityMessage.hide();
        }    
    });    

});