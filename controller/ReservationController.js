"use strict"

const { validationResult } = require("express-validator");
const moment = require('moment');
const errorHandler = require("../errorHandler");

class ReservationController {
    // Constructor
    constructor(daoRes, daoUni, daoFac) {
        this.daoRes = daoRes;
        this.daoUni = daoUni;
        this.daoFac = daoFac;

        this.reservations = this.reservations.bind(this);
        this.userReservations = this.userReservations.bind(this);
        this.reserve = this.reserve.bind(this);
        this.queued = this.queued.bind(this);
    }

    // Métodos

    // --- GET ---
    // Obtener todas las reservas
    reservations(request, response, next) {
        let idUniversity = request.session.university.id;
        this.daoRes.readAll(idUniversity, (error, reservations) => {
            if (error) {
                errorHandler.manageError(error, {}, "error", next);
            }
            else {
                // Obtener facultades
                this.daoUni.readAllFaculties(request.session.university.mail, (error, faculties) => {
                    if (error) {
                        errorHandler.manageError(error, {}, "error", next);
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
                                    messagesUnread: request.unreadMessages
                                },
                                reservations: reservations,
                                filters: new Array(),
                                faculties: faculties
                            }
                        });
                    }
                });
            }
        });
    }

    // Obtener reservas de un usuario
    userReservations(request, response, next) {
        this.daoRes.readAllByUser(request.session.currentUser.id, (error, reservations) => {
            if (error) {
                errorHandler.manageError(error, {}, "error", next);
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
                    // Comparar fecha con hoy                            
                    if (formattedDate < today) {
                        // Si es antigua y se quedó en cola es como si no hubiera existido
                        if (!res.queued) {
                            oldReservations.push(res);
                        }
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
                            messagesUnread: request.unreadMessages
                        },
                        currentReservations: currentReservations,
                        oldReservations: oldReservations
                    }
                });
            }
        });
    }

    // --- POST ---
    // Hacer una reserva
    reserve(request, response, next) {
        console.log("Hola 1");
        let data = {
            generalInfo: {
                idUniversity: request.session.university.id,
                name: request.session.university.name,
                web: request.session.university.web,
                address: request.session.university.address,
                hasLogo: request.session.university.hasLogo,
                idUser: request.session.currentUser.id,
                isAdmin: request.session.currentUser.rol,
                hasProfilePic: request.session.currentUser.hasProfilePic,
                messagesUnread: request.unreadMessages
            },
            facilities: request.session.facilities,
            facilityTypeName: request.session.facilityTypeName,
            facilityTypeHasPic: request.session.facilityTypeHasPic
        }
        console.log("Hola 2");
        const errors = validationResult(request);
        if (errors.isEmpty()) {
            console.log("Hola 3");
            // Obtener parámetros de entrada
            let idFacility = request.body.idFacility;
            let date = request.body.date;
            let hour = request.body.hour;
            let nPeople = request.body.nPeople;
            // Comprobar que el día y la hora son posteriores a hoy
            let currentDate = moment(); // Momento actual
            // Juntar fecha y hora en un "moment"
            let dateAndHour = `${date} ${hour}`;
            let momentRes = moment(dateAndHour, 'YYYY-MM-DD HH:mm');
            // Comprobar si la fecha y hora son posteriores a la actual
            if (momentRes.isBefore(currentDate)) {
                errorHandler.manageError(8, data, "user_facilities", next);
            }
            else {
                // Comprobar que la instalación es válida
                this.daoFac.read(idFacility, request.session.university.id, (error, facility) => {
                    console.log("Hola 4");
                    if (error) {
                        errorHandler.manageError(error, data, "user_facilities", next);
                    }
                    else {
                        console.log("Hola 5");
                        // Comprobar que Nº personas <= Aforo
                        if (nPeople > facility.capacity) {
                            errorHandler.manageError(10, data, "user_facilities", next);
                        }
                        else {
                            console.log("Hola 6");
                            // Comprobar hora en los intervalos válidos de la instalación
                            // Pasar horas de string a moment
                            let hourMoment = moment(hour, "HH:mm");
                            let startHourMoment = moment(facility.startHour, "HH:mm:ss");
                            let endHourMoment = moment(facility.endHour, "HH:mm:ss");
                            if (hourMoment.isBefore(startHourMoment) || hourMoment.isAfter(endHourMoment)) {
                                errorHandler.manageError(11, data, "user_facilities", next);
                            }
                            else {
                                console.log("Hola 7");
                                // Comprobar si no había reservado ya esa instalación ese día a esa hora
                                this.daoRes.readByUnique(request.session.currentUser.id, idFacility, date, hour, (error, reservation) => {
                                    if (error) {
                                        errorHandler.manageError(error, data, "user_facilities", next);
                                    }
                                    else {
                                        if (reservation) {
                                            errorHandler.manageError(12, data, "user_facilities", next);
                                        }
                                        else {
                                            // Comprobar si se le mete en la cola
                                            this.daoRes.readByDateAndHour(date, hour, idFacility, (error, reservations) => {
                                                if (error) {
                                                    errorHandler.manageError(error, data, "user_facilities", next);
                                                }
                                                else {
                                                    this.queued(facility.reservationType, reservations, nPeople, facility.capacity, (queued) => {
                                                        console.log("Hola 8");
                                                        let newReservation = {
                                                            idUser: request.session.currentUser.id,
                                                            idFacility: facility.id,
                                                            nPeople: nPeople,
                                                            date: date,
                                                            hour: hour,
                                                            queued: queued
                                                        }
                                                        this.daoRes.create(newReservation, (error) => {
                                                            if (error) {
                                                                errorHandler.manageError(error, data, "user_facilities", next);
                                                            }
                                                            else {
                                                                let msg = "";
                                                                if (queued) { msg = "Se ha realizado la reserva y has sido añadido a la cola de espera. Si alguno delante cancela se te avisará."; }
                                                                else { msg = "Se ha realizado la reserva con éxito!"; }
                                                                // Añadir mensaje de respuesta a data
                                                                data.error = {
                                                                    code: 200,
                                                                    title: "Reserva realizada",
                                                                    message: msg
                                                                }
                                                                console.log(data);
                                                                next({
                                                                    ajax: false,
                                                                    status: 200,
                                                                    redirect: "user_facilities",
                                                                    data: data
                                                                });
                                                            }
                                                        });
                                                    });
                                                }
                                            });
                                        }
                                    }
                                });
                            }
                        }
                    }
                });
            }
        }
        else {
            console.log("AQUI");
            console.log(errors.array()[0]);
            errorHandler.manageError(parseInt(errors.array()[0].msg), data, "user_facilities", next);
        }
    }

    // Comprobar si la reserva debe ponerse en cola
    queued(reservationType, reservations, nPeople, capacity, callback) {
        // Una instalación individual sólo puede reservarse 1 vez simultáneamente
        if (reservationType === "Individual" && reservations.length > 0) {
            callback(true);
        }
        // Si es colectiva, comprobar que no supera el aforo
        else if (reservationType === "Colectiva") {
            let currentPeople = 0;
            // Calcular espacios ocupados
            reservations.forEach((res) => {
                if (!res.queued) {
                    currentPeople += res.nPeople;
                }
            });
            if (currentPeople + nPeople > capacity) {
                callback(true);
            }
            else {
                callback(false);
            }
        }
        else {
            callback(false);
        }
    }
}

module.exports = ReservationController;