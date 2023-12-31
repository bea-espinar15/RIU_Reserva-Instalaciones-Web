"use strict"

// Cuando cargue el DOM
$(() => {

    // POST cancelar reserva (AJAX)
    const buttonsCancel = $("[id^='button-sb-cancel-']");
    const reservationsTable = $("#div-current-reservations");

    buttonsCancel.each(function (i, btn) {
        let button = $(btn);
        button.on("click", (event) => {
            event.preventDefault();
            let idReservation = button.data("idreservation");

            // Petición POST
            $.ajax({
                method: "POST",
                url: "/usuario/cancelar",
                data: { idReservation: idReservation },
                success: (data, statusText, jqXHR) => {
                    // Eliminar reserva de la lista
                    reservationsTable.find(`#div-reservation-${idReservation}`).remove();
                    // Mostrar modal
                    showModal(data, $("#div-modal-response-header"), $("#img-modal-response"), $("#h1-modal-response"), $("#p-modal-response"), $("#button-modal-response-ok"), $("#button-modal-response"));
                },
                error: (jqXHR, statusText, errorThrown) => {
                    showModal(jqXHR.responseJSON, $("#div-modal-response-header"), $("#img-modal-response"), $("#h1-modal-response"), $("#p-modal-response"), $("#button-modal-response-ok"), $("#button-modal-response"));
                }
            });
        });
    });

    // Al cerrar el modal, quitar el backdrop
    $('#modal-response').on('hidden.bs.modal', function () {
        $('.modal-backdrop').remove();
        $('body').css('overflow', 'auto');
    });

});