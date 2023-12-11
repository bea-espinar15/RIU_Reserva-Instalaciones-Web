"use strict"

const mailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

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

    // Cuando se cambia el correo, si es uno de los válidos se traen las facultades
    const inputMail = $("#input-mail");
    const inputFaculty = $("#input-faculty");

    inputMail.on("change", () => {
        let mail = inputMail.val();
        // Si es un correo
        if (mailRegex.test(mail)) {
            // Si es uno de los válidos
            let mailAfterAt = mail.split("@")[1];
            if (universityMails.includes(mailAfterAt)) {
                // Petición GET
                $.ajax({
                    method: "GET",
                    url: "/facultades",
                    data: {
                        mail: mailAfterAt
                    },
                    success: (data, statusText, jqXHR) => {
                        // Resetear combo
                        inputFaculty.empty();
                        // Meter facultades obtenidas
                        (data.faculties).forEach((fac) => {
                            inputFaculty.append(`<option value="${fac.name}">${fac.name}</option>`);
                        });
                    }
                });
            }
        }
        else {
            // Resetear combo
            inputFaculty.empty();
            inputFaculty.append("<option value=\"null\">Introduce tu correo</option>");
        }
    });
    
});