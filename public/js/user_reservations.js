"use strict"

// Cuando cargue el DOM
$(() => {

    // POST cancelar reserva (AJAX)
    const buttonsCancel = $(".button-sb-cancel");
    const reservationsTable = $("#div-current-reservations");

    buttonsCancel.each(function (i, btn) {
        let button = $(this);
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
                    showModal(data, $("#div-modal-error-header"), $("#img-modal-error"), $("#h1-modal-error"), $("#p-modal-error"), $("#button-modal-error-ok"), $("#button-modal-error"));
                },
                error: (jqXHR, statusText, errorThrown) => {
                    showModal(jqXHR.responseJSON, $("#div-modal-error-header"), $("#img-modal-error"), $("#h1-modal-error"), $("#p-modal-error"), $("#button-modal-error-ok"), $("#button-modal-error"));
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