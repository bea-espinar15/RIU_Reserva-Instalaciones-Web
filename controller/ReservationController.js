"use strict"

const errorHandler = require("../errorHandler");

class ReservationController {
    // Constructor
    constructor (daoRes, daoMes) {
        this.daoRes = daoRes;
        this.daoMes = daoMes;

        this.reservations = this.reservations.bind(this);
        this.userReservations = this.userReservations.bind(this);
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

    // Obtener reservas de un usuario
    userReservations (request, response, next) {
        this.daoRes.readAllByUser(request.session.currentUser.id, (error, reservations) => {
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
                        // Separar actuales de antiguas
                        let currentReservations = new Array();
                        let oldReservations = new Array();
                        let today = new Date();
                        reservations.forEach((res) => {
                            // Pasar la fecha a objeto Date para comparar
                            let formattedDate = res.date.split('/');
                            formattedDate = new Date(`${formattedDate[2]}-${formattedDate[1]}-${formattedDate[0]}`);
                            
                            if (formattedDate < today) {
                                oldReservations.push(res);
                            }
                            else {
                                currentReservations.push(res);
                            }
                        });

                        next({
                            ajax: false,
                            status: 200,
                            redirect: "user_reservations",
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
                                currentReservations: currentReservations,
                                oldReservations: oldReservations
                            }
                        });    
                    }
                });
            }
        });
    }
}

module.exports = ReservationController;