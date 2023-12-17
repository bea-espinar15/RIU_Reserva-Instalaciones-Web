"use strict"

// Validación Cliente
function validateNewFacility(params) {
    let error = {};
    // Campos no vacíos
    if (params.name === "" || params.startHour === "" || params.endHour === "" || params.reservationType === "" || params.capacity === "" || params.facilityType === ""){
        error.code = 400;
        error.title = "Campos vacíos";
        error.message = "Asegúrate de rellenar todos los campos.";
        return error;
    }
    // Comprobar que se ha seleccionado un tipo
    else if (params.facilityType === "") {
        error.code = 400;
        error.title = "Tipo no seleccionado";
        error.message = "Por favor, selecciona el tipo de instalación que deseas o crea uno nuevo.";
        return error;
    }
    // Comprobar que la hora_fin > hora_ini
    else if (new Date(`2000-01-01T${params.startHour}:00`) >= new Date(`2000-01-01T${params.endHour}:00`)) {
        error.code = 400;
        error.title = "Hora no válida";
        error.message = "Las horas de apertura y cierre deben ser horas en punto, y la hora de cierre debe ser posterior a la de apertura.";
        return error;
    }
    // Horas exactas
    else if (params.startHour.split(":")[1] !== "00" || params.endHour.split(":")[1] !== "00") {
        error.code = 400;
        error.title = "Hora no válida";
        error.message = "Las horas de apertura y cierre deben ser horas en punto, y la hora de cierre debe ser posterior a la de apertura.";
        return error;
    }
    // El aforo no es un número o no es mayor a 0
    else if (params.capacity <= 0) {
        error.code = 400;
        error.title = "Aforo no válido";
        error.message = "El aforo debe ser un número mayor que 0.";
        return error;
    }
    else {
        return null;
    }
}

function validateName(name) {
    let error = {};
    // Campos no vacíos
    if (name === "") {
        error.code = 400;
        error.title = "Nombre vacío";
        error.message = "Asegúrate de rellenar todos los campos.";
        return error;
    }
    else {
        return null;
    }
}

$(() => {

    // Obtener elementos
    const facilitiesContainer = $("#div-facilities-container");
    const showFacilityContainer = $("#div-show-facility");
    const buttonNewFacility = $("#button-new-facility");
    const facilitiesTable = $("#div-results");
    const facilities = $(".div-facility");
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
        showFacilityContainer.hide();
        let divFacility = $(this);
        let facility = divFacility.data("facility");
        let typeHasPic = divFacility.data("typehaspic");
        // Rellenar contenido del div
        let timestamp = new Date().getTime();
        if (facility.hasPic) { facilityPic.attr("src", `/fotoInstalacion/${facility.id}?timestamp=${timestamp}`); }
        else if (typeHasPic) { facilityPic.attr("src", `/fotoTipoInstalacion/${facility.idType}`); }
        else { facilityPic.attr("src", "/img/default/facility.png"); }
        nameFacility.val(facility.name);
        typeFacility.val(facility.facilityTypeName);
        startHourFacility.val(facility.startHour);
        endHourFacility.val(facility.endHour);
        resTypeFacility.val(facility.reservationType);
        capacityFacility.val(facility.capacity);
        buttonSbFacility.data("idfacility", facility.id);
        buttonSbFacility.data("idfacilitytype", facility.idType);
        buttonSbFacility.data("new", false);
        // Desactivar inputs
        nameFacility.removeAttr("disabled");
        typeFacility.attr("disabled", "true");
        startHourFacility.attr("disabled", "true");
        endHourFacility.attr("disabled", "true");
        resTypeFacility.attr("disabled", "true");
        capacityFacility.attr("disabled", "true");
        // Ocultar div instalaciones si la pantalla es pequeña
        if ($(window).width() <= 992) {
            facilitiesContainer.hide();
        }
        // Mostrar div
        showFacilityContainer.fadeIn(250);
        // Desplazar al usuario arriba del todo
        $('html, body').animate({
            scrollTop: 0
        }, 100);
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
        if ($(window).width() <= 992) {
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

    // Búsqueda por nombre
    buttonSearch.on("click", (event) => {
        event.preventDefault();
        let anyFacility = 0;
        // Filtrar array
        facilities.find(".button-see-more").each(function(i, buttonFac) {
            let buttonFacility = $(buttonFac);
            let facility = buttonFacility.data("facility");
            let divFacility = $(`#div-facility-${facility.id}`);
            if ((facility.name).toLowerCase().includes((inputSearch.val()).toLowerCase())) {
                anyFacility++;
                divFacility.show();
            }
            else {
                divFacility.hide();
            } 
        });
        
        // Actualizar mensaje de resultados
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

    // POST crear instalación (AJAX)   
    buttonSbFacility.on("click", (event) => {
        event.preventDefault();
        if (buttonSbFacility.data("new")) {
            let params = {
                name: nameFacility.val(),
                startHour: startHourFacility.val(),
                endHour: endHourFacility.val(),
                reservationType: resTypeFacility.val(),
                capacity: parseInt(capacityFacility.val()),
                facilityType: typeFacility.val()
            }
            // Validar input
            let error = validateNewFacility(params);
            if (!error) {
                // Obtener imagen (crear formData)
                let formData = new FormData();
                let fileInput = pictureFacility[0].files[0];
                formData.append("facilityPic", fileInput);
                formData.append("name", nameFacility.val());
                formData.append("startHour", startHourFacility.val());
                formData.append("endHour", endHourFacility.val());
                formData.append("reservationType", resTypeFacility.val());
                formData.append("capacity", capacityFacility.val());
                formData.append("facilityType", typeFacility.val());                
                $.ajax({
                    method: "POST",
                    url: "/admin/crearInstalacion",
                    data: formData,
                    processData: false,
                    contentType: false,
                    success: (data, statusText, jqXHR) => {
                        // Añadir instalación a la lista
                        const divNewFacility = $(`<div id="div-facility-${data.facility.id}" class="div-facility justify-content-between">
                                                    <div class="d-flex flex-column">
                                                        <h2>${data.facility.name}</h2>
                                                        <p>${data.facility.typeName}</p>
                                                    </div>
                                                    <button type="button" class="button-see-more bg-riu-primary-dark align-items-end" data-typehaspic="${data.facility.typeHasPic}">Ver más</button>
                                                </div>`);
                        facilitiesTable.append(divNewFacility);
    
                        // Añadir info al botón para poder mostrarla
                        let buttonSeeMore = facilitiesTable.find('button').last();
                        buttonSeeMore.data("facility", data.facility);
    
                        // Actualizar ver resultados
                        let facs = facilities.length;
                        if (facs === 0) {
                            noFacilityMessage.text(`Ver ${facs+1} resultado`);
                        }
                        else {
                            noFacilityMessage.text(`Ver ${facs+1} resultados`);
                        }
    
                        // Ocultar el formulario
                        showFacilityContainer.hide();
                        // Mostrar modal
                        showModal(data, $("#div-modal-response-header"), $("#img-modal-response"), $("#h1-modal-response"), $("#p-modal-response"), $("#button-modal-response-ok"), $("#button-modal-response"));
                    },
                    error: (jqXHR, statusText, errorThrown) => {
                        showModal(jqXHR.responseJSON, $("#div-modal-response-header"), $("#img-modal-response"), $("#h1-modal-response"), $("#p-modal-response"), $("#button-modal-response-ok"), $("#button-modal-response"));
                    }
                });
            }
            else {
                showModal(error, $("#div-modal-response-header"), $("#img-modal-response"), $("#h1-modal-response"), $("#p-modal-response"), $("#button-modal-response-ok"), $("#button-modal-response"));
            }
        }
        // POST editar instalación (AJAX)
        else {
            // Validar
            let error = validateName(nameFacility.val());
            if (!error) {
                // Obtener foto de la instalación
                let formData = new FormData();
                let fileInput = pictureFacility[0].files[0];
                formData.append("facilityPic", fileInput);
                formData.append("name", nameFacility.val());
                formData.append("idFacilityType", buttonSbFacility.data("idfacilitytype"));
                formData.append("idFacility", buttonSbFacility.data("idfacility"));
                let idFacility = buttonSbFacility.data("idfacility");
                $.ajax({
                    method: "POST",
                    url: "/admin/editarInstalacion",
                    data: formData,
                    processData: false,
                    contentType: false,
                    success: (data, statusText, jqXHR) => {
                        // Actualizar foto de la instalación
                        if (fileInput) {
                            // Para no usar la imagen que tenías en caché si no volver a pedirla al servidor
                            let timestamp = new Date().getTime();
                            facilityPic.attr("src", `/fotoInstalacion/${idFacility}?timestamp=${timestamp}`);
                        }
                        else {
                            facilityPic.attr("src", "/img/default/facility.png");
                        }
                        // Actualizar el botón de ver más
                        ($(`#div-facility-${idFacility}`).find("h2")).text(nameFacility.val());
                        let buttonEditFacility = $(`#div-facility-${idFacility}`).find(".button-see-more");
                        let editFac = buttonEditFacility.data("facility");
                        editFac.name = nameFacility.val();
                        editFac.hasPic = fileInput ? true : false;
                        buttonEditFacility.data("facility", editFac);
                        // Mostrar modal
                        showModal(data, $("#div-modal-response-header"), $("#img-modal-response"), $("#h1-modal-response"), $("#p-modal-response"), $("#button-modal-response-ok"), $("#button-modal-response"));
                    },
                    error: (jqXHR, statusText, errorThrown) => {
                        showModal(jqXHR.responseJSON, $("#div-modal-response-header"), $("#img-modal-response"), $("#h1-modal-response"), $("#p-modal-response"), $("#button-modal-response-ok"), $("#button-modal-response"));
                    }
                });
            }
            else {
                showModal(error, $("#div-modal-response-header"), $("#img-modal-response"), $("#h1-modal-response"), $("#p-modal-response"), $("#button-modal-response-ok"), $("#button-modal-response"));
            }
        }
    });

    // Modal nuevo tipo
    const buttonSbNewType = $("#button-sb-new-type");
    const inputFacilityTypeName = $("#input-facility-type-name");
    const inputFacilityTypePic = $("#input-facility-type-pic");
    
    // Al seleccionar un nuevo tipo, se abre el modal:
    typeFacility.on("change", () => {
        if (typeFacility.val() === "newType") {
            typeFacility.val("");
            inputFacilityTypeName.val("");
            inputFacilityTypePic.val("");
            buttonModalNewType.click();
        }        
    });

    // POST crear nuevo tipo (AJAX)
    buttonSbNewType.on("click", (event) => {
        event.preventDefault();
        let error = validateName(inputFacilityTypeName.val());
        if (!error) {
            // Obtener foto del tipo
            let formData = new FormData();
            let fileInput = inputFacilityTypePic[0].files[0];
            formData.append("facilityTypePic", fileInput);
            formData.append("name", inputFacilityTypeName.val());
            $.ajax({
                method: "POST",
                url: "/admin/crearTipo",
                data: formData,
                processData: false,
                contentType: false,
                success: (data, statusText, jqXHR) => { 
                    // Añadir la opción al select
                    typeFacility.append(`<option value="${inputFacilityTypeName.val()}">${inputFacilityTypeName.val()}</option>`);
                    // Seleccionar esa opción
                    typeFacility.val(inputFacilityTypeName.val());
                    // Mostrar modal
                    showModal(data, $("#div-modal-response-header"), $("#img-modal-response"), $("#h1-modal-response"), $("#p-modal-response"), $("#button-modal-response-ok"), $("#button-modal-response"));
                },
                error: (jqXHR, statusText, errorThrown) => {
                    showModal(jqXHR.responseJSON, $("#div-modal-response-header"), $("#img-modal-response"), $("#h1-modal-response"), $("#p-modal-response"), $("#button-modal-response-ok"), $("#button-modal-response"));
                }
            });
        }
        else {
            showModal(error, $("#div-modal-response-header"), $("#img-modal-response"), $("#h1-modal-response"), $("#p-modal-response"), $("#button-modal-response-ok"), $("#button-modal-response"));
        }       
    });

    // Ocultar texto Buscar si pantalla es muy pequeña
    if ($(window).width() <= 340) {
        buttonSearch.html(`<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" class="bi bi-search" viewBox="0 0 16 16">
                                <path d="M11.742 10.344a6.5 6.5 0 1 0-1.397 1.398h-.001c.03.04.062.078.098.115l3.85 3.85a1 1 0 0 0 1.415-1.414l-3.85-3.85a1.007 1.007 0 0 0-.115-.1zM12 6.5a5.5 5.5 0 1 1-11 0 5.5 5.5 0 0 1 11 0z" />
                           </svg>`);
    }
    

});