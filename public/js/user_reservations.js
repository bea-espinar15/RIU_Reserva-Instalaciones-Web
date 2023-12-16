"use strict"

$(() => {

    // POST cancelar reserva (AJAX)
    const buttonsCancel = $(".button-sb-cancel");
    const reservationsTable = $("#div-current-reservations");

    // Botón del modal respuesta/error
    const buttonModalError = $("#button-modal-error");
    const modalErrorHeader = $("#div-modal-error-header");
    const imgModalError = $("#img-modal-error");
    const modalErrorTitle = $("#h1-modal-error");
    const modalErrorMessage = $("#p-modal-error");
    const buttonErrorOk = $("#button-modal-error-ok");

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
        });
    });

    $('#modal-response').on('hidden.bs.modal', function () {
        $('.modal-backdrop').remove();
    });

});