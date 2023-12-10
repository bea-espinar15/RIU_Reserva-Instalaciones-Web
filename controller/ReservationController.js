"use strict"

const errorHandler = require("../errorHandler");

class ReservationController {
    // Constructor
    constructor (daoRes, daoMes) {
        this.daoRes = daoRes;
        this.daoMes = daoMes;

        this.reservations = this.reservations.bind(this);
    }

    // Métodos
    // Obtener todas las reservas
    reservations (request, response, next) {
        let idUniversity = request.session.university.id;
        this.daoRes.readAll(idUniversity, (error, reservations) => {
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
                            redirect: "admin_reservations",
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
                                reservations: reservations,
                                filters: new Array()
                            }
                        });    
                    }
                });
            }
        });
    }
}

module.exports = ReservationController;