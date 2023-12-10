"use strict"

const errorHandler = require("../errorHandler");

class MessageController {
    // Constructor
    constructor(daoMes) {
        this.daoMes = daoMes;

        this.adminIndex = this.adminIndex.bind(this);
        this.adminSettings = this.adminSettings.bind(this);
    }

    // Métodos
    // Cargar inicio de admin
    adminIndex(request, response, next) {
        // Obtener mensajes no leídos
        this.daoMes.messagesUnread(request.session.currentUser.id, (error, nUnreadMessages) => {
            if (error) {
                errorHandler.manageError(error, "error", next);
            }
            else {
                next({
                    ajax: false,
                    status: 200,
                    redirect: "admin_index",
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
                        adminName: request.session.currentUser.name
                    }
                });
            }
        });
    }

    // Cargar configuración de admin
    adminSettings(request, response, next) {
        // Obtener mensajes no leídos
        this.daoMes.messagesUnread(request.session.currentUser.id, (error, nUnreadMessages) => {
            if (error) {
                errorHandler.manageError(error, "error", next);
            }
            else {
                next({
                    ajax: false,
                    status: 200,
                    redirect: "admin_settings",
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
                        university: request.session.university
                    }
                });
            }
        });
    }
}

module.exports = MessageController;