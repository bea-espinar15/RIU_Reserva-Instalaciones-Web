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
function validateDate(date) {
    let error = {};
    let dateObj = new Date(date);

    // Campo no vacío
    if (date === "") {
        error.code = 400;
        error.title = "Campos vacíos";
        error.message = "Asegúrate de rellenar todos los campos.";
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

function validateHour(date, hour) {
    let error = {};

    let actualDate = new Date();
    let dateObj = new Date(date + "T" + hour);
    
    // Campos no vacíos
    if (date === "" || hour === "") {
        error.code = 400;
        error.title = "Campos vacíos";
        error.message = "Asegúrate de rellenar todos los campos.";
        return error;
    }
    // Comprobar que la fecha y hora no son anteriores a la actual
    else if (dateObj < actualDate){
        error.code = 400;
        error.title = "Fecha y hora no válidas";
        error.message = "La reserva debe realizarse en un día (y hora) posterior a este momento.";
        return error;
    }    
    else {
        return null;
    }
}

function validateNPeople(nPeople, capacity) {
    let error = {};
    // Campo no vacío
    if (isNaN(nPeople)) {
        error.code = 400;
        error.title = "Campos vacíos";
        error.message = "Asegúrate de indicar cuántos asistiréis a la reserva.";
        return error;
    }
    // El número de personas no es un número o no es mayor a 0
    else if (nPeople < 0 || nPeople > capacity) {
        error.code = 400;
        error.title = "Nº personas no válido";
        error.message = `Recuerda introducir un número de personas válido y que sea menor o igual que el aforo de la instalación que deseas reservar (${capacity}).`;
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
            showFacilityContainer.hide();
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
                hoursTable.append(`<span class="badge bg-riu-gray" title="Hora disponible">${hour}</span>`);
            });
            hoursTable.on("click", ".badge", function() {
                let hour = $(this);
                // Dependiendo del color le cambiamos el title
                hoursTable.find(".bg-riu-red.bg-riu-blue").attr("title", "Hora llena, entrarás en cola");
                hoursTable.find(".bg-riu-yellow.bg-riu-blue").attr("title", "Hay reservas a esta hora, puede que no haya plazas suficientes");
                hoursTable.find(".bg-riu-gray.bg-riu-blue").attr("title", "Hora disponible");
                // Deja de ser azul
                hoursTable.find(".bg-riu-blue").removeClass("bg-riu-blue");                
                hour.addClass("bg-riu-blue");
                hour.attr("title", "Hora seleccionada");
                inputHour.attr("value", hour.text());
            });
            // Actualizar aforo máximo
            nPeopleModal.attr("max", facility.capacity);
            // Ocultar div instalaciones si la pantalla es pequeña
            if ($(window).width() <= 768) {
                facilitiesContainer.hide();
            } 
            // Mostrar div            
            showFacilityContainer.fadeIn(250);
            // Desplazar al usuario arriba del todo
            $('html, body').animate({
                scrollTop: 0
            }, 100);
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
    const buttonModalReserve = $("#button-modal-reserve");

    // Al abrir el modal, actualizamos los campos
    buttonReserve.on("click", () => {
        let date = facilityDate.val();
        let hour = inputHour.val();
        // Validar día y hora
        let error = validateDate(date);
        if (!error) { error = validateHour(date, hour); }
        if (!error) {
            nPeopleModal.val(nPeopleFilter.val());        
            // Formatear a DD/MM/AAAA
            let parts = date.split('-');
            let formattedDate = `${parts[2]}/${parts[1]}/${parts[0]}`;
            pDate.text(`Fecha: ${formattedDate}`);
            // Obtener hora seleccionada
            pHour.text(`Hora: ${hour}`);
            // Mostrar modal
            buttonModalReserve.click();
        }
        else {
            showModal(error, $("#div-modal-error-header"), $("#img-modal-error"), $("#h1-modal-error"), $("#p-modal-error"), $("#button-modal-error-ok"), $("#button-modal-error"));
        }

    });

    // Cuando se establece una fecha se traen las horas disponibles/ocupadas
    facilityDate.on("change", () => {
        let date = facilityDate.val();
        let idFacility = inputIdFacility.val();
        let error = validateDate(date);
        if (!error) {
            // GET horasOcupadas (AJAX)
            $.ajax({
                method: "GET",
                url: "/usuario/horasDisponibles",
                data: {
                    date: date,
                    idFacility: idFacility
                },
                success: (data, statusText, jqXHR) => {
                    // Poner en rojo las horas ocupadas y en amarillo las que tienen pocas plazas
                    hoursTable.children("span").each(function(i, hour) {
                        let hourSpan = $(this);
                        // Hora ocupada
                        if ((data.hoursFull).includes(hourSpan.text())) {
                            hourSpan.removeClass("bg-riu-gray");
                            hourSpan.addClass("bg-riu-red");
                            hourSpan.attr("title", "Hora llena, entrarás en cola");
                        }
                        else if ((data.hoursAlmost).includes(hourSpan.text())) {
                            hourSpan.removeClass("bg-riu-gray");
                            hourSpan.addClass("bg-riu-yellow");
                            hourSpan.attr("title", "Hay reservas a esta hora, puede que no haya plazas suficientes");
                        }
                    });
                },
                error: (jqXHR, statusText, errorThrown) => {
                    showModal(jqXHR.responseJSON, $("#div-modal-error-header"), $("#img-modal-error"), $("#h1-modal-error"), $("#p-modal-error"), $("#button-modal-error-ok"), $("#button-modal-error"));
                }
            });
        }
        else {
            showModal(error, $("#div-modal-error-header"), $("#img-modal-error"), $("#h1-modal-error"), $("#p-modal-error"), $("#button-modal-error-ok"), $("#button-modal-error"));
        }
    });

    // POST reservar
    buttonSbReserve.on("click", () => {
        // Validar
        let error = validateNPeople(parseInt(nPeopleModal.val()), parseInt(nPeopleModal.attr("max")));
        if (!error) {
            formReserve.submit();
        }
        else {
            showModal(error, $("#div-modal-error-header"), $("#img-modal-error"), $("#h1-modal-error"), $("#p-modal-error"), $("#button-modal-error-ok"), $("#button-modal-error"));
        }
    });

});