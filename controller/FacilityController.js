"use strict"

const { validationResult } = require("express-validator");
const errorHandler = require("../errorHandler");

class FacilityController {
    // Constructor
    constructor(daoFac, daoMes) {
        this.daoFac = daoFac;
        this.daoMes = daoMes;

        this.facilities = this.facilities.bind(this);
        this.facilitiesByType = this.facilitiesByType.bind(this);
        this.facilityTypes = this.facilityTypes.bind(this);
    }

    // Métodos
    // Instalaciones de una universidad
    facilities(request, response, next) {
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
                                            idUniversity: request.session.university.id,
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

    // Tipos de instalaciones
    facilityTypes(request, response, next) {
        this.daoFac.readAllTypes(request.session.university.id, (error, types) => {
            if (error) {
                errorHandler.manageError(error, "error", next);
            }
            else {
                // Obtener mensajes no leídos
                this.daoMes.messagesUnread(request.session.currentUser.id, (error, nUnreadMessages) => {
                    if (error) {
                        errorHandler.manageError(error, "error", next);
                    }
                    else {
                        next({
                            ajax: false,
                            status: 200,
                            redirect: "user_index",
                            data: {
                                error: undefined,
                                generalInfo: {
                                    idUniversity: request.session.university.id,
                                    name: request.session.university.name,
                                    web: request.session.university.web,
                                    address: request.session.university.address,
                                    hasLogo: request.session.university.hasLogo,
                                    idUser: request.session.currentUser.id,
                                    isAdmin: request.session.currentUser.rol,
                                    hasProfilePic: request.session.currentUser.hasProfilePic,
                                    messagesUnread: nUnreadMessages
                                },
                                facilityTypes: types
                            }
                        });
                    }
                });
            }
        });
    }

    // Instalaciones por tipo
    facilitiesByType(request, response, next) {
        const errors = validationResult(request);
        if (errors.isEmpty()) {
            let idType = request.params.id;
            this.daoFac.readFacilitiesByType(idType, (error, facilities) => {
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
                            next({
                                ajax: false,
                                status: 200,
                                redirect: "user_facilities",
                                data: {
                                    error: undefined,
                                    generalInfo: {
                                        idUniversity: request.session.university.id,
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
                                    facilityTypeName: facilities[0].facilityTypeName
                                }
                            });
                        }
                    });
                }
            });
        }
        else {
            errorHandler.manageError(parseInt(errors.array()[0].msg), "error", next);
        }
    }
}

module.exports = FacilityController;