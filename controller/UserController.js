"use strict"

const { validationResult } = require("express-validator");
const errorHandler = require("../errorHandler");

class UserController {
    // Constructor
    constructor(daoUse, daoUni, daoMes, daoFac) {
        this.daoUse = daoUse;
        this.daoUni = daoUni;
        this.daoMes = daoMes;
        this.daoFac = daoFac;

        this.users = this.users.bind(this);
        this.profile = this.profile.bind(this);
        this.adminIndex = this.adminIndex.bind(this);
        this.login = this.login.bind(this);
        this.logout = this.logout.bind(this);
    }

    // Métodos
    // -- GET --
    // Obtener todos los usuarios
    users(request, response, next) {
        this.daoUse.readAll(request.session.university.id, (error, users) => {
            if (error) {
                errorHandler.manageError(error, "error", next);
            }
            else {
                // Separar admins de no-admins
                let regularUsers = new Array();
                let admins = new Array();
                users.forEach((user) => {
                    if (user.rol) {
                        admins.push(user);
                    }
                    else {
                        regularUsers.push(user);
                    }
                });
                next({
                    ajax: false,
                    status: 200,
                    redirect: "admin_users",
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
                        users: regularUsers,
                        admins: admins,
                        universityMail: request.session.university.mail
                    }
                });
            }
        });
    }

    // Cargar perfil
    profile(request, response, next) {
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
                    messagesUnread: request.unreadMessages
                },
                user: request.session.currentUser,
                universityMail: request.session.university.mail
            }
        });
    }

    // Cargar inicio de admin
    adminIndex (request, response, next) {
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
                    messagesUnread: request.unreadMessages
                },
                adminName: request.session.currentUser.name
            }
        });
    }

    // -- POST -- 
    // Inicio sesión
    login(request, response, next) {
        const errors = validationResult(request);
        if (errors.isEmpty()) {
            // Separar nombre usuario y universidad
            let userMail = request.body.mail.split("@")[0];
            let uniMail = request.body.mail.split("@")[1];
            // Obtener universidad
            this.daoUni.readByMail(uniMail, (error, university) => {
                if (error) {
                    errorHandler.manageError(error, next);
                }
                else {
                    // Obtener usuario
                    let idUniversity = university.id;
                    this.daoUse.readByUniversity(userMail, idUniversity, (error, user) => {
                        // Comprobar que existe en esa universidad
                        if (error) {
                            errorHandler.manageError(error, "login", next);
                        }
                        else {
                            // Comprobar que el usuario está validado
                            if (!user.validated) {
                                errorHandler.manageError(4, "login", next);
                            }
                            // Comprobar contraseña
                            else if (request.body.password != user.password) {
                                errorHandler.manageError(5, "login", next);
                            }
                            else {
                                // Obtener nº mensajes no leídos del usuario
                                this.daoMes.messagesUnread(user.id, (error, nUnreadMessages) => {
                                    if (error) {
                                        errorHandler.manageError(error, "login", next);
                                    }
                                    else {
                                        // Quitar contraseña, no se guarda en la sesión
                                        delete (user.password);
                                        // Iniciar sesión
                                        request.session.currentUser = user;
                                        request.session.university = university;
                                        // Construir data
                                        let data = {
                                            error: undefined,
                                            generalInfo: {
                                                idUniversity: university.id,
                                                name: university.name,
                                                web: university.web,
                                                address: university.address,
                                                hasLogo: university.hasLogo,
                                                idUser: user.id,
                                                isAdmin: user.rol,
                                                hasProfilePic: user.hasProfilePic,
                                                messagesUnread: nUnreadMessages
                                            }
                                        };
                                        if (user.rol) { // Admin
                                            data.adminName = user.name;
                                            next({
                                                ajax: false,
                                                status: 200,
                                                redirect: "admin_index",
                                                data: data
                                            });
                                        }
                                        else { // User
                                            // Obtener tipos de instalaciones de la universidad
                                            this.daoFac.readAllTypes(university.id, (error, types) => {
                                                if (error) {
                                                    errorHandler.manageError(error, "login", next);
                                                }
                                                else {
                                                    data.facilityTypes = types;
                                                    next({
                                                        ajax: false,
                                                        status: 200,
                                                        redirect: "user_index",
                                                        data: data
                                                    });
                                                }
                                            });                                            
                                        }
                                    }
                                });
                            }
                        }
                    });
                }
            });
        }
        else {
            errorHandler.manageError(parseInt(errors.array()[0].msg), "login", next);
        }
    }

    // Cerrar sesión
    logout(request, response, next) {
        request.session.destroy();
        next({
            ajax: false,
            status: 200,
            redirect: "login",
            data: {
                error: undefined
            }
        });
    }
}

module.exports = UserController;