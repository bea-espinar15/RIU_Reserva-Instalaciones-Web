"use strict"

$(() => {

    let universityMails;

    // Petición GET (AJAX) para obtener los correos que puede introducir el usuario
    $.ajax({
        method: "GET",
        url: "/correosDisponibles",
        success: (data, statusText, jqXHR) => {
            universityMails = data.universityMails;
        }
    });
    
});