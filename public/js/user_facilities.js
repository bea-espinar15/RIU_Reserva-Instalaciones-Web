"use strict"

// Generar horas entre startHour y endHour
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

// Validación Cliente
function validateParamsReserve(params) {
    let error;

    let actualDate = new Date();
    let dateObj = new Date(params.date + "T" + params.hour);
    
    // Campos no vacíos
    if (params.date === "" || params.hour === "" || params.idFacility === "" || params.idFacilityType === "" || params.nPeople === "" ) {
        error.code = 400;
        error.title = "Campos vacíos";
        error.message = "Asegúrate de rellenar todos los campos.";
        return error;
    }
    // El número de personas no es un número o no es mayor a 0
    else if (params.nPeople <= 0 && params.nPeople > params.capacity) {
        error.code = 400;
        error.title = "Nº personas no válido";
        error.message = "Recuerda introducir un número de personas válido y que sea menor o igual que el aforo de la instalación que deseas reservar.";
        return error;
    }
    // Comprobar que la fecha y hora no son anteriores a la actual
    else if (dateObj < actualDate){
        error.code = 400;
        error.title = "Fecha y hora no válidas";
        error.message = "La reserva debe realizarse en un día (y hora) posterior a este momento.";
        return error;
    }
    // Comprobar que la fecha no cae en sábado o domingo
    else if (dateObj.getDay() === 0 || dateObj.getDay() === 6){
        error.code = 400;
        error.title = "Fecha no válida";
        error.message = "Las instalaciones no están disponibles los fines de semana.";
        return error;
    }
    else {
        return null;
    }
}

// Cuando cargue el DOM
$(() => {

    // Obtener elementos
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

    // Mostrar y ocultar divs
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
            // Ruta foto instalación
            if (facility.hasPic) { facilityPic.attr("src", `/fotoInstalacion/${facility.id}`); }
            else if (typeHasPic) { facilityPic.attr("src", `/fotoTipoInstalacion/${facility.idType}`); }
            else { facilityPic.attr("src", "/img/default/facility.png"); }
            // Nombre instalación
            nameFacility.text(facility.name);
            // Mensaje aviso colectiva
            if (facility.reservationType === "Colectiva") { warningResType.show(); }
            else { warningResType.hide(); }
            // Máximo nPeople (modal) es el aforo
            nPeopleModal.attr("max", facility.capacity);
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
        // Filtrar array
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
        // Mensaje nº resultados
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
        let params = {
            date: facilityDate.val(),
            hour: inputHour.val(),
            idFacility: parseInt(inputIdFacility.val()),
            idFacilityType: parseInt(inputIdFacilityType.val()),
            nPeople: parseInt(nPeopleModal.val()),
            capacity: parseInt(nPeopleModal.attr("max"))
        };
        // Validar
        let error = validateParamsReserve(params);
        if (!error) {
            formReserve.submit();
        }
        else {
            showModal(error, $("#div-modal-error-header"), $("#img-modal-error"), $("#h1-modal-error"), $("#p-modal-error"), $("#button-modal-error-ok"), $("#button-modal-error"));
        }
    });

});