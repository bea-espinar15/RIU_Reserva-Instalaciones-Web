"use strict"

const errorHandler = require("../errorHandler");

class FacilityController {
    // Constructor
    constructor (daoFac, daoMes) {
        this.daoFac = daoFac;
        this.daoMes = daoMes;

        this.facilities = this.facilities.bind(this);
    }

    // Métodos
    facilities (request, response, next) {
        let idUniversity = request.session.university.id;
        this.daoFac.readAll(idUniversity, (error, facilities) => {
            if (error) {
                errorHandler.manageError(error, "error", next);
            }
            else {
                // Obtener nº mensajes no leídos del usuario
                this.daoMes.messagesUnread(request.session.currentUser.id, (error, nUnreadMessages) => {
                    if (error) {
                        errorHandler.manageError(error, "error", next);
                    }
                    else {
                        this.daoFac.readAllTypes(idUniversity, (error, types) => {
                            if (error) {
                                errorHandler.manageError(error, "error", next);
                            }
                            else {
                                next({
                                    ajax: false,
                                    status: 200,
                                    redirect: "admin_facilities",
                                    data: {
                                        error: undefined,
                                        generalInfo: {
                                            idUniversity: idUniversity,
                                            name: request.session.university.name,
                                            web: request.session.university.web,
                                            address: request.session.university.address,
                                            hasLogo: request.session.university.hasLogo,
                                            idUser: request.session.currentUser.id,
                                            isAdmin: request.session.currentUser.rol,
                                            hasProfilePic: request.session.currentUser.hasProfilePic,
                                            messagesUnread: nUnreadMessages
                                        },
                                        facilities: facilities,
                                        facilityTypes: types
                                    }
                                });
                            }
                        });                        
                    }
                });                
            }
        });
    }
}

module.exports = FacilityController;