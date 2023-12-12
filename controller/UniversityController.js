"use strict"

const { validationResult } = require("express-validator");
const errorHandler = require("../errorHandler");

class UniversityController {
    // Constructor
    constructor (daoUni) {
        this.daoUni = daoUni;
        
        this.universityMails = this.universityMails.bind(this);
        this.faculties = this.faculties.bind(this);
        this.universityPic = this.universityPic.bind(this);
        this.adminSettings = this.adminSettings.bind(this);
        this.changeSettings = this.changeSettings.bind(this);
    }

    // Métodos

    // --- GET ---
    // Obtener correos de las universidades registradas
    universityMails(request, response, next) {
        this.daoUni.readAll((error, universities) => {
            if (error) {                
                errorHandler.manageAJAXError(error, next);
            }
            else { 
                // Quedarnos sólo con los correos
                let universityMails = new Array();
                universities.forEach(uni => {
                    universityMails.push(uni.mail);
                });
                // Guardar correos en la sesión
                request.session.universityMails = universityMails;
                // Manejar respuesta
                next({
                    ajax: true,
                    data: {
                        universityMails: universityMails 
                    }
                });
            }
        });        
    }

    // Obtener facultades de una universidad a partir de su correo
    faculties(request, response, next) {
        this.daoUni.readAllFaculties(request.query.mail, (error, faculties) => {
            if (error) {                
                errorHandler.manageAJAXError(error, next);
            }
            else {                
                // Manejar respuesta
                next({
                    ajax: true,
                    data: {
                        faculties: faculties 
                    }
                });
            }
        });  
    }

    // Obtener foto de la universidad
    universityPic(request, response, next) {        
        const errors = validationResult(request);
        if (errors.isEmpty()) {
            this.daoUni.readPic(request.params.id, (error, pic) => {
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

    // Cargar configuración de admin
    adminSettings(request, response, next) {
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
                    messagesUnread: request.unreadMessages
                },
                university: request.session.university
            }
        });
    }

    // --- POST ---
    // Cambiar configuración
    changeSettings(request, response, next) {
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
            university: request.session.university
        }
        const errors = validationResult(request);
        if (errors.isEmpty()) {
            let pic = request.file;
            // Comprobar formato foto, si hay
            if (pic && (pic.mimetype !== "image/png" || pic.size > 64 * 1024)) {
                errorHandler.manageError(14, data, "admin_settings", next);
            }
            else {
                let newSettings = {
                    idUniversity: request.session.university.id,
                    name: request.body.settingsName,
                    address: request.body.settingsAddress,
                    web: request.body.settingsWeb,                    
                    pic: pic ? pic.buffer : null
                }
                // Actualizar
                this.daoUni.changeSettings(newSettings, (error) => {
                    if (error) {
                        errorHandler.manageError(error, {}, "error", next);
                    }
                    else {
                        // Actualizar variables de sesión
                        let newUniversity = {
                            id: request.session.university.id,
                            name: newSettings.name,
                            address: newSettings.address,
                            web: newSettings.web,
                            mail: request.session.university.mail,
                            hasLogo: newSettings.pic ? true : request.session.university.hasLogo
                        }
                        request.session.university = newUniversity;
                        // Reconstruimos data para redirigir a inicio
                        let data = {
                            error: {
                                code: 200,
                                title: "Configuración actualizada",
                                message: "Los datos de la universidad se han modificado con éxito"
                            },
                            generalInfo: {
                                idUniversity: newUniversity.id,
                                name: newUniversity.name,
                                web: newUniversity.web,
                                address: newUniversity.address,
                                hasLogo: newUniversity.hasLogo,
                                idUser: request.session.currentUser.id,
                                isAdmin: request.session.currentUser.rol,
                                hasProfilePic: request.session.currentUser.hasProfilePic,
                                messagesUnread: request.unreadMessages
                            },
                            adminName: request.session.currentUser.name
                        } 
                        next({
                            ajax: false,
                            status: 200,
                            redirect: "admin_index",
                            data: data
                        });
                    }
                });
            }
        }
        else {
            errorHandler.manageError(parseInt(errors.array()[0].msg), data, "admin_settings", next);
        }
    }
}

module.exports = UniversityController;