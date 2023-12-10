"use strict"

const errorHandler = require("../errorHandler");

class MessageController {
    // Constructor
    constructor(daoMes) {
        this.daoMes = daoMes;

        this.mails = this.mails.bind(this);
        this.profile = this.profile.bind(this);
        this.adminIndex = this.adminIndex.bind(this);
        this.adminSettings = this.adminSettings.bind(this);
    }

    // Métodos
    // Cargar mensajes
    mails (request, response, next) {
        this.daoMes.readAll(request.session.currentUser.id, (error, messages) => {
            if (error) {
                errorHandler.manageError(error, "error", next);
            }
            else {
                next({
                    ajax: false,
                    status: 200,
                    redirect: "mail",
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
                            messagesUnread: 0
                        },
                        messages: messages,
                        universityMail: request.session.university.mail
                    }
                });
            }
        });
    }

    // Cargar perfil
    profile(request, response, next) {
        // Obtener mensajes no leídos
        this.daoMes.messagesUnread(request.session.currentUser.id, (error, nUnreadMessages) => {
            if (error) {
                errorHandler.manageError(error, "error", next);
            }
            else {
                next({
                    ajax: false,
                    status: 200,
                    redirect: "profile",
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
                        user: request.session.currentUser,
                        universityMail: request.session.university.mail
                    }
                });
            }
        });
    }
    
    // Cargar inicio de admin
    adminIndex (request, response, next) {
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
    adminSettings (request, response, next) {
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