"use strict"

const { validationResult } = require("express-validator");
const errorHandler = require("../errorHandler");

class MessageController {
    // Constructor
    constructor(daoMes, daoUni, daoUse) {
        this.daoMes = daoMes;
        this.daoUni = daoUni;
        this.daoUse = daoUse;

        this.mails = this.mails.bind(this);
        this.unreadMessages = this.unreadMessages.bind(this);
        this.sendMessage = this.sendMessage.bind(this);
        this.markAsRead = this.markAsRead.bind(this);
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
                // Obtener facultades de la universidad
                this.daoUni.readAllFaculties(request.session.university.mail, (error, faculties) => {
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
                                universityMail: request.session.university.mail,
                                faculties: faculties
                            }
                        });
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
    sendMessage(request, response, next) {
        const errors = validationResult(request);
        if (errors.isEmpty()) {
            // Si eres usuario normal o eres admin y vas a enviar a sólo 1 usuario
            if (!request.session.currentUser.rol || (request.session.currentUser.rol && request.body.faculty === "" && request.body.university === "false")) {
                // Usuario no vacío
                if (request.body.mail === "") {
                    errorHandler.manageAJAXError(1, next);
                }
                else {
                    // Obtener usuario destino
                    this.daoUse.readByUniversity(request.body.mail, request.session.university.id, (error, user) => {
                        if (error) {
                            errorHandler.manageAJAXError(error, next);
                        }
                        else {
                            // Comprobar si existe el usuario en esa universidad
                            if (!user || !user.validated) {
                                errorHandler.manageAJAXError(23, next);
                            }
                            else {
                                let newMessage = {
                                    idSender: request.session.currentUser.id,
                                    idReceiver: user.id,
                                    message: request.body.message,
                                    subject: request.body.subject
                                };
                                // Enviar mensaje
                                this.daoMes.create(newMessage, (error) => {
                                    if (error) {
                                        errorHandler.manageAJAXError(error, next);
                                    }
                                    else {
                                        // Terminar
                                        next({
                                            ajax: true,
                                            error: false,
                                            img: false,
                                            data: {
                                                code: 200,
                                                title: "Mensaje enviado",
                                                message: `El mensaje se ha enviado correctamente a ${user.mail}`
                                            }
                                        });
                                    }
                                });
                            }
                        }
                    });
                }
            }
            else { // Si eres admin
                // Comprobar que sólo se ha seleccionado 1 de las 3 opciones para enviar
                let moreThanOneSelected = request.body.mail !== "" && (request.body.faculty !== "" || request.body.university !== "false");
                moreThanOneSelected = moreThanOneSelected || (request.body.faculty !== "" && request.body.university !== "false");
                if (moreThanOneSelected) {
                    errorHandler.manageAJAXError(24, next);
                }
                else {
                    // Enviar correo a todos los de una facultad
                    if (request.body.faculty !== "") {
                        this.daoUni.readAllFaculties(request.session.university.mail, (error, faculties) => {
                            if (error) {
                                errorHandler.manageAJAXError(error, next);
                            }
                            else {
                                // Comprobar que la facultad existe en esa universidad
                                if (!faculties.find((fac) => fac.name === request.body.faculty)) {
                                    errorHandler.manageAJAXError(16, next);
                                }
                                else {
                                    this.daoUse.readAllByFaculty(request.body.faculty, request.session.university.id, (error, users) => {
                                        if (error) {
                                            errorHandler.manageAJAXError(error, next);
                                        }
                                        else {
                                            // Enviar mensajes a todos los de la facultad
                                            let cont = users.length;
                                            let errorOcurred = false;

                                            users.forEach((user) => {
                                                if (user.id !== request.session.currentUser.id && user.enabled && user.validated) {
                                                    let newMessage = {
                                                        idSender: request.session.currentUser.id,
                                                        idReceiver: user.id,
                                                        message: request.body.message,
                                                        subject: request.body.subject
                                                    };
                                                    this.daoMes.create(newMessage, (error) => {
                                                        if (error) {
                                                            errorOcurred = true;
                                                            errorHandler.manageAJAXError(error, next);
                                                        }
    
                                                        // Un usuario menos al que enviar
                                                        cont--;
    
                                                        // Si se han enviado mensajes a todos los usuarios y no ha habido ningún error, terminamos
                                                        if (cont === 0 && !errorOcurred) {
                                                            // Terminar
                                                            next({
                                                                ajax: true,
                                                                error: false,
                                                                img: false,
                                                                data: {
                                                                    code: 200,
                                                                    title: "Mensajes enviados",
                                                                    message: `El mensaje se ha enviado correctamente a todos los usuarios de la facultad de ${request.body.faculty}.`
                                                                }
                                                            });
                                                        }
                                                    });
                                                }    
                                                else {
                                                    // Un usuario menos al que enviar
                                                    cont--;
    
                                                    // Si se han enviado mensajes a todos los usuarios y no ha habido ningún error, terminamos
                                                    if (cont === 0 && !errorOcurred) {
                                                        // Terminar
                                                        next({
                                                            ajax: true,
                                                            error: false,
                                                            img: false,
                                                            data: {
                                                                code: 200,
                                                                title: "Mensajes enviados",
                                                                message: `El mensaje se ha enviado correctamente a todos los usuarios de la facultad de ${request.body.faculty}.`
                                                            }
                                                        });
                                                    }
                                                }                                            
                                            });
                                        }
                                    });
                                }
                            }
                        });
                    }
                    // Enviar correo a todos los de la universidad
                    else {
                        this.daoUse.readAll(request.session.university.id, (error, users) => {
                            if (error) {
                                errorHandler.manageAJAXError(error, next);
                            }
                            else {
                                // Enviar mensajes a todos los de la universidad
                                let cont = users.length;
                                let errorOcurred = false;

                                users.forEach((user) => {
                                    if (user.enabled && user.validated && user.id !== request.session.currentUser.id) {
                                        let newMessage = {
                                            idSender: request.session.currentUser.id,
                                            idReceiver: user.id,
                                            message: request.body.message,
                                            subject: request.body.subject
                                        };
                                        this.daoMes.create(newMessage, (error) => {
                                            if (error) {
                                                errorOcurred = true;
                                                errorHandler.manageAJAXError(error, next);
                                            }

                                            // Un usuario menos al que enviar
                                            cont--;

                                            // Si se han enviado mensajes a todos los usuarios y no ha habido ningún error, terminamos
                                            if (cont === 0 && !errorOcurred) {
                                                // Terminar
                                                next({
                                                    ajax: true,
                                                    error: false,
                                                    img: false,
                                                    data: {
                                                        code: 200,
                                                        title: "Mensajes enviados",
                                                        message: `El mensaje se ha enviado correctamente a todos los usuarios de la universidad.`
                                                    }
                                                });
                                            }
                                        });
                                    }
                                    else {
                                        // Un usuario menos al que enviar
                                        cont--;

                                        // Si se han enviado mensajes a todos los usuarios y no ha habido ningún error, terminamos
                                        if (cont === 0 && !errorOcurred) {
                                            // Terminar
                                            next({
                                                ajax: true,
                                                error: false,
                                                img: false,
                                                data: {
                                                    code: 200,
                                                    title: "Mensajes enviados",
                                                    message: `El mensaje se ha enviado correctamente a todos los usuarios de la universidad.`
                                                }
                                            });
                                        }
                                    }
                                });
                            }
                        });
                    }
                }
            }
        }
        else {
            errorHandler.manageAJAXError(parseInt(errors.array()[0].msg), next);
        }
    }

    // Marcar como leído
    markAsRead(request, response, next) {
        
        const errors = validationResult(request);
        if (errors.isEmpty()) {
            // Obtener mensaje
            let idMessage = parseInt(request.body.idMessage);
            this.daoMes.read(idMessage, request.session.currentUser.id, (error, message) => {
                if (error) {
                    errorHandler.manageAJAXError(error, next);
                }
                else {
                    // Comprobar que no estaba ya leído
                    if (message.readDate) {
                        errorHandler.manageAJAXError(26, next);
                    }
                    else {
                        // Poner fecha_leído = hoy
                        this.daoMes.markAsRead(idMessage, (error) => {
                            if (error) {
                                errorHandler.manageAJAXError(error, next);
                            }
                            else {
                                // Terminamos
                                next({
                                    ajax: true,
                                    error: false,
                                    img: false,
                                    data: {}
                                });
                            }
                        });
                    }
                }
            });
        }
        else {
            errorHandler.manageAJAXError(parseInt(errors.array()[0].msg), next);
        }
    }

}

module.exports = MessageController;