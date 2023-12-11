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

    // --- Mostrar y ocultar divs ---

    const facilitiesContainer = $("#div-facilities-container");
    const showFacilityContainer = $("#div-show-facility");
    const facilities = $(".div-facility");
    const buttonsSeeMore = $(".button-see-more");
    const buttonBack = $("#button-facility-back");
    const nPeopleFilter = $("#input-n-people");
    const buttonFilter = $("#button-filter");
    const noFacilityMessage = $("#p-no-facilities");
    // Contenido de la instalación
    const facilityPic = $("#img-facility-pic");
    const nameFacility = $("#h2-facility-name");
    const warningResType = $("#p-warning-res-type");    
    const hoursTable = $("#div-hours");
    const inputHour = $("#input-hour");
    const inputIdFacility = $("#input-id-facility");
    const inputIdFacilityType = $("#input-id-facility-type");
    const nPeopleModal = $("#input-facility-n-people");

    facilitiesContainer.show();
    showFacilityContainer.hide();

    // Número de resultados
    if (facilities.length > 0) {
        noFacilityMessage.hide();
    }
    else {
        noFacilityMessage.show();
    }
    
    // Cuando se pulsa una instalación, se muestran sus detalles
    buttonsSeeMore.each(function(i, fac) {
        let divFacility = $(this);
        divFacility.on("click", () => {
            let facility = divFacility.data("facility");
            let typeHasPic = divFacility.data("typehaspic");
            // Rellenar contenido del div
            inputIdFacility.attr("value", facility.id);
            inputIdFacilityType.attr("value", facility.idType);
            if (facility.hasPic) { facilityPic.attr("src", `/fotoInstalacion/${facility.id}`); }
            else if (typeHasPic) { facilityPic.attr("src", `/fotoTipoInstalacion/${facility.idType}`); }
            else { facilityPic.attr("src", "/img/default/facility.png"); }
            nameFacility.text(facility.name);
            if (facility.reservationType === "Colectiva") { warningResType.show(); }
            else { warningResType.hide(); }
            // Generar horas
            let hours = generateHours(facility.startHour, facility.endHour);
            hoursTable.empty();
            hours.forEach((hour) => {
                hoursTable.append(`<span class="badge bg-riu-gray">${hour}</span>`);
            });
            hoursTable.on("click", ".badge", function() {
                let hour = $(this);
                hoursTable.find(".bg-riu-blue").addClass("bg-riu-gray");
                hoursTable.find(".bg-riu-blue").removeClass("bg-riu-blue");                
                hour.removeClass("bg-riu-gray");
                hour.addClass("bg-riu-blue");
                inputHour.attr("value", hour.text());
            });
            // Actualizar aforo máximo
            nPeopleModal.attr("max", facility.capacity);
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

    // --- Formulario reserva ---
    const formReserve = $("#form-reserve");
    const facilityDate = $("#input-facility-date");
    const buttonReserve = $("#button-reserve");
    const pDate = $("#p-date");
    const pHour = $("#p-hour");
    const buttonSbReserve = $("#button-sb-reserve");

    // Al abrir el modal, actualizamos los campos
    buttonReserve.on("click", () => {
        nPeopleModal.val(nPeopleFilter.val());
        let date = facilityDate.val();
        // Formatear a DD/MM/AAAA
        let parts = date.split('-');
        let formattedDate = `${parts[2]}/${parts[1]}/${parts[0]}`;
        pDate.text(`Fecha: ${formattedDate}`);
        // Obtener hora seleccionada
        pHour.text(`Hora: ${inputHour.val()}`);
    });

    // POST reservar
    buttonSbReserve.on("click", (event) => {
        event.preventDefault();
        formReserve.submit();
    });

});