"use strict"

const { validationResult } = require("express-validator");
const bcrypt = require("bcrypt");
const errorHandler = require("../errorHandler");

// Cifrar contraseña
const saltRounds = 10;

class UserController {
    // Constructor
    constructor(daoUse, daoUni, daoFac, daoMes) {
        this.daoUse = daoUse;
        this.daoUni = daoUni;
        this.daoFac = daoFac;
        this.daoMes = daoMes;

        this.userBanned = this.userBanned.bind(this);
        this.isAdmin = this.isAdmin.bind(this);
        this.accessPicAllowed = this.accessPicAllowed.bind(this);
        this.users = this.users.bind(this);
        this.profilePic = this.profilePic.bind(this);
        this.profile = this.profile.bind(this);
        this.adminIndex = this.adminIndex.bind(this);
        this.login = this.login.bind(this);
        this.logout = this.logout.bind(this);
        this.signUp = this.signUp.bind(this);
        this.validate = this.validate.bind(this);
    }

    // Métodos

    // --- GET ---
    // Comprobar si un usuario está baneado
    userBanned(request, response, next) {
        this.daoUse.read(request.session.currentUser.id, (error, user) => {
            if (error) {
                errorHandler.manageError(error, {}, "error", next);
            }
            else {
                if (!user.enabled) {
                    // Cerrarle sesión y redirigirle al login
                    request.session.destroy();
                    errorHandler.manageError(6, {}, "login", next);
                }
                else {
                    next();
                }
            }
        });
    }

    // Comprobar si un usuario es admin
    isAdmin(request, response, next) {        
        if (request.session.currentUser.rol) {
            next();
        }
        else {
            errorHandler.manageAJAXError(-3, next);
        }
    }

    // Comprobar si un usuario (no admin) está intentando acceder a otra foto de perfil
    accessPicAllowed(request, response, next) {
        if (request.session.currentUser.rol || parseInt(request.params.id) === request.session.currentUser.id) {
            next();
        }
        else {
            errorHandler.manageAJAXError(-3, next);
        }
    }

    // Obtener todos los usuarios
    users(request, response, next) {
        this.daoUse.readAll(request.session.university.id, (error, users) => {
            if (error) {
                errorHandler.manageError(error, {}, "error", next);
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

    // Obtener foto de perfil de un usuario
    profilePic(request, response, next) {        
        const errors = validationResult(request);
        if (errors.isEmpty()) {
            this.daoUse.readPic(request.params.id, (error, pic) => {
                if (error) {
                    errorHandler.manageError(error, {}, "error", next);
                }
                else {
                    next({
                        ajax: true,
                        error: false,
                        img: pic
                    });
                }
            });
        }
        else {
            errorHandler.manageError(parseInt(errors.array()[0].msg), {}, "error", next);
        }
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
    adminIndex(request, response, next) {
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
                    errorHandler.manageError(error, {}, "error", next);
                }
                else {
                    // Obtener usuario
                    let idUniversity = university.id;
                    this.daoUse.readByUniversity(userMail, idUniversity, (error, user) => {
                        // Comprobar que existe en esa universidad
                        if (error) {
                            errorHandler.manageError(error, {}, "login", next);
                        }
                        else {
                            // Comprobar que el usuario está validado
                            if (!user.validated) {
                                errorHandler.manageError(4, {}, "login", next);
                            }
                            // Comprobar contraseña con bcrypt
                            else {
                                bcrypt.compare(request.body.password, user.password, (err, result) => {
                                    if (error) {
                                        errorHandler.manageError(error, {}, "login", next);
                                    }
                                    else if (!result) {
                                        errorHandler.manageError(5, {}, "login", next);
                                    }
                                    else {
                                        // Obtener nº mensajes no leídos del usuario
                                        this.daoMes.messagesUnread(user.id, (error, nUnreadMessages) => {
                                            if (error) {
                                                errorHandler.manageError(error, {}, "login", next);
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
                                                            errorHandler.manageError(error, {}, "login", next);
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
                                });
                            }
                        }
                    });
                }
            });
        }
        else {
            errorHandler.manageError(parseInt(errors.array()[0].msg), {}, "login", next);
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

    // Registro
    signUp(request, response, next) {
        const errors = validationResult(request);
        if (errors.isEmpty()) {
            // Obtener parámetros de entrada
            let params =  {
                name: request.body.name,
                lastname1: request.body.lastname1,
                lastname2: request.body.lastname2,
                mailUser: (request.body.mail).split("@")[0],
                mailUni: (request.body.mail).split("@")[1],
                password: request.body.password,
                faculty: request.body.faculty
            }
            // Comprobar que la facultad es una válida de las que hay en esa universidad
            this.daoUni.readAllFaculties(params.mailUni, (error, faculties) => {
                if (error) {
                    errorHandler.manageAJAXError(error, next);
                }
                else {
                    // Obtener ID de la facultad y comprobar que existe
                    let idFaculty;
                    let facultyExists = faculties.find((fac) => {
                        if (fac.name === params.faculty) {
                            idFaculty = fac.id;
                            return true;
                        }
                        return false;
                    });
                    if (!facultyExists) {
                        errorHandler.manageAJAXError(16, next);
                    }
                    else {
                        // Comprobar que el correo no estaba ya registrado en esa universidad
                        this.daoUse.readUserByMail(params.mailUser, params.mailUni, (error) => {
                            if (error) {
                                errorHandler.manageAJAXError(error, next);
                            }
                            else {
                                // Cifrar contraseña
                                bcrypt.genSalt(saltRounds, (error, salt) => {
                                    if (error) {
                                        errorHandler.manageAJAXError(error, next);
                                    }
                                    else {
                                        bcrypt.hash(params.password, salt, (error, hashedPassword) => {
                                            if (error) {
                                                errorHandler.manageAJAXError(error, next);
                                            }
                                            else {
                                                // Crear usuario
                                                let newUser = {
                                                    name: params.name,
                                                    lastname1: params.lastname1,
                                                    lastname2: params.lastname2,
                                                    mail: params.mailUser,
                                                    password: hashedPassword,
                                                    idFaculty: idFaculty,
                                                }
                                                this.daoUse.create(newUser, (error) => {
                                                    if (error) {
                                                        errorHandler.manageAJAXError(error, next);
                                                    }
                                                    else {
                                                        next({
                                                            ajax: true,
                                                            error: false,
                                                            img: false,
                                                            data: {
                                                                code: 200,
                                                                title: "Registro completado",
                                                                message: "Has sido registrado con éxito! Cuando un administrador te valide, podrás iniciar sesión. Este proceso no suele llevar más de 24 horas."
                                                            }
                                                        });
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
            });
        }
        else {
            errorHandler.manageAJAXError(parseInt(errors.array()[0].msg), next);
        }        
    }

    // Validar usuario
    validate(request, response, next) {
        const errors = validationResult(request);
        if (errors.isEmpty()) {
            let idUser = request.body.idUser;
            this.daoUse.read(idUser, (error, user) => {
                if (error) {
                    errorHandler.manageAJAXError(error, next);
                }
                else {
                    if(!user.enabled){
                        errorHandler.manageAJAXError(18, next);
                    }
                    else if (user.validated) {
                        errorHandler.manageAJAXError(19, next);
                    }
                    else {
                        this.daoUse.validate(idUser, (error) => {
                            if (error) {
                                errorHandler.manageAJAXError(error, next);
                            }
                            else {
                                next({
                                    ajax: true,
                                    error: false,
                                    img: false,
                                    data: {
                                        code: 200,
                                        title: "Usuario validado",
                                        message: "El usuario ha sido validado con éxito!"
                                    }
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

module.exports = UserController;