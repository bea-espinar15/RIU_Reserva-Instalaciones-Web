"use strict"

const errorHandler = require("../errorHandler");

class UniversityController {
    // Constructor
    constructor (daoUni) {
        this.daoUni = daoUni;
        
        this.universityMails = this.universityMails.bind(this);
    }

    // Métodos
    // Obtener correos de las universidades registradas
    universityMails (request, response, next) {
        this.daoUni.readAll((error, universities) => {
            if (error) {                
                errorHandler.manageAJAXError(error, next);
            }
            else {                
                // Quedarnos sólo con los correos
                let universityMails = new Array();
                universities.forEach(uni => {
                    universityMails.push(uni.mail);
                });
                // Guardar correos en la sesión
                request.session.universityMails = universityMails;
                // Manejar respuesta
                next({
                    ajax: true,
                    data: {
                        universityMails: universityMails 
                    }
                });
            }
        });        
    }
}

module.exports = UniversityController;