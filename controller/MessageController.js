"use strict"

const errorHandler = require("../errorHandler");

class MessageController {
    // Constructor
    constructor(daoMes) {
        this.daoMes = daoMes;

        this.mails = this.mails.bind(this);
        this.unreadMessages = this.unreadMessages.bind(this);
    }

    // Métodos

    // --- GET ---
    // Cargar mensajes
    mails(request, response, next) {
        this.daoMes.readAll(request.session.currentUser.id, (error, messages) => {
            if (error) {
                errorHandler.manageError(error, {}, "error", next);
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

    // Obtener mensajes no leídos (y meterlos en request para otros middlewares)
    unreadMessages(request, response, next) {
        // Obtener mensajes no leídos
        this.daoMes.messagesUnread(request.session.currentUser.id, (error, nUnreadMessages) => {
            if (error) {
                errorHandler.manageError(error, {}, "error", next);
            }
            else {
                request.unreadMessages = nUnreadMessages;
                next();
            }
        });
    }

    // --- POST ---

}

module.exports = MessageController;