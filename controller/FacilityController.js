"use strict"

const { validationResult } = require("express-validator");
const errorHandler = require("../errorHandler");

class FacilityController {
    // Constructor
    constructor(daoFac) {
        this.daoFac = daoFac;

        this.facilities = this.facilities.bind(this);        
        this.facilityTypes = this.facilityTypes.bind(this);
        this.facilitiesByType = this.facilitiesByType.bind(this);
        this.facilityTypePic = this.facilityTypePic.bind(this);
        this.facilityPic = this.facilityPic.bind(this);
        this.newFacility = this.newFacility.bind(this);
        this.editFacility = this.editFacility.bind(this);
        this.newType = this.newType.bind(this);
    }

    // Métodos

    // --- GET ---
    // Instalaciones de una universidad
    facilities(request, response, next) {
        let idUniversity = request.session.university.id;
        this.daoFac.readAll(idUniversity, (error, facilities) => {
            if (error) {
                errorHandler.manageError(error, {}, "error", next);
            }
            else {
                this.daoFac.readAllTypes(idUniversity, (error, types) => {
                    if (error) {
                        errorHandler.manageError(error, {}, "error", next);
                    }
                    else {
                        next({
                            ajax: false,
                            status: 200,
                            redirect: "admin_facilities",
                            data: {
                                response: undefined,
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
                                facilities: facilities,
                                facilityTypes: types
                            }
                        });
                    }
                });
            }
        });
    }

    // Tipos de instalaciones
    facilityTypes(request, response, next) {
        this.daoFac.readAllValidTypes(request.session.university.id, (error, types) => {
            if (error) {
                errorHandler.manageError(error, {}, "error", next);
            }
            else {
                next({
                    ajax: false,
                    status: 200,
                    redirect: "user_index",
                    data: {
                        response: undefined,
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
                        facilityTypes: types
                    }
                });
            }
        });
    }

    // Instalaciones por tipo
    facilitiesByType(request, response, next) {
        const errors = validationResult(request);
        if (errors.isEmpty()) {
            let idType = request.params.id;
            this.daoFac.readFacilitiesByType(idType, (error, facilities) => {
                if (error) {
                    errorHandler.manageError(error, {}, "error", next);
                }
                else {
                    if (facilities.length === 0) {
                        errorHandler.manageError(-3, {}, "error", next);
                    }
                    else {
                        // Actualizar variables de sesión
                        request.session.facilities = facilities;
                        request.session.facilityTypeName = facilities[0].facilityTypeName;
                        request.session.facilityTypeHasPic = facilities[0].facilityTypeHasPic;
                        // Render
                        next({
                            ajax: false,
                            status: 200,
                            redirect: "user_facilities",
                            data: {
                                response: undefined,
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
                                facilities: facilities,
                                facilityTypeName: facilities[0].facilityTypeName,
                                facilityTypeHasPic: facilities[0].facilityTypeHasPic
                            }
                        });
                    }                    
                }
            });
        }
        else {
            errorHandler.manageError(parseInt(errors.array()[0].msg), {}, "error", next);
        }
    }

    // Obtener foto de un tipo de instalación
    facilityTypePic(request, response, next) {        
        const errors = validationResult(request);
        if (errors.isEmpty()) {
            this.daoFac.readFacilityTypePic(request.params.id, (error, pic) => {
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

    // Obtener foto de una instalación
    facilityPic(request, response, next) {        
        const errors = validationResult(request);
        if (errors.isEmpty()) {
            this.daoFac.readFacilityPic(request.params.id, (error, pic) => {
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

    // --- POST ---
    // Crear nueva instalación
    newFacility(request, response, next) {
        const errors = validationResult(request);
        if (errors.isEmpty()) {
            // Comprobar formato foto
            let pic = request.file;
            // Comprobar formato foto, si hay
            if (pic && (pic.mimetype !== "image/png" || pic.size > 64 * 1024)) {
                errorHandler.manageAJAXError(14, next);
            }
            else {
                let params = {
                    name: request.body.name,
                    startHour: request.body.startHour,
                    endHour: request.body.endHour,
                    reservationType: request.body.reservationType,
                    capacity: request.body.capacity,
                    facilityType: request.body.facilityType,
                    facilityPic: pic ? pic.buffer : null
                }
                // Comprobar hora_fin > hora_ini
                if (new Date(`2000-01-01T${params.startHour}:00`) >= new Date(`2000-01-01T${params.endHour}:00`)) {
                    errorHandler.manageAJAXError(27, next);
                }
                else {
                    // Obtener tipos disponibles
                    this.daoFac.readAllTypes(request.session.university.id, (error, types) => {
                        if (error) {
                            errorHandler.manageAJAXError(error, next);
                        }
                        else {
                            let idFacilityType;
                            let typeHasPic;
                            let includesType = types.find((type) => { 
                                if (type.name === params.facilityType) {
                                    idFacilityType = type.id;
                                    typeHasPic = type.hasPic;
                                    return true;
                                }
                                else {
                                    return false;
                                }
                            });
                            // Comprobar si el tipo existe y es uno de los de la universidad
                            if (!includesType) {
                                errorHandler.manageAJAXError(29, next);
                            }
                            else {
                                // Comprobar si esa instalación ya existía para ese tipo (nombre repetido)
                                this.daoFac.readByType(params.name, idFacilityType, (error, facility) => {
                                    if (error) {
                                        errorHandler.manageAJAXError(error, next);
                                    }
                                    else {
                                        if (facility) {
                                            errorHandler.manageAJAXError(30, next);
                                        }
                                        else {
                                            params.idFacilityType = idFacilityType;
                                            // Crear la instalación
                                            this.daoFac.create(params, (error, insertId) => {
                                                if (error) {
                                                    errorHandler.manageAJAXError(error, next);
                                                }
                                                else {
                                                    let newFacility = {
                                                        id: insertId,
                                                        name: params.name,
                                                        startHour: params.startHour,
                                                        endHour: params.endHour,
                                                        reservationType: params.reservationType,
                                                        capacity: params.capacity,
                                                        hasPic: params.facilityPic ? true : false,
                                                        idType: idFacilityType,
                                                        typeName: params.facilityType,
                                                        typeHasPic: typeHasPic
                                                    }
                                                    next({
                                                        ajax: true,
                                                        error: false,
                                                        img: false,
                                                        data: {
                                                            code: 200,
                                                            title: "Instalación creada",
                                                            message: "Instalación creada con éxito",
                                                            facility: newFacility
                                                        }
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
            }
        }
        else {
            errorHandler.manageAJAXError(parseInt(errors.array()[0].msg), next);
        }
    }

    // Editar instalación
    editFacility(request, response, next) {
        const errors = validationResult(request);
        if (errors.isEmpty()) {
            let pic = request.file;
            let idFacility = parseInt(request.body.idFacility);
            let idFacilityType = parseInt(request.body.idFacilityType);
            // Comprobar formato foto, si hay
            if (pic && (pic.mimetype !== "image/png" || pic.size > 64 * 1024)) {
                errorHandler.manageAJAXError(14, next);
            }
            else {
                let facilityPic = pic ? pic.buffer : null
                // Comprobar si esa instalación ya existía para ese tipo (nombre repetido)
                this.daoFac.readByType(request.body.name, idFacilityType, (error, facility) => {
                    if (error) {
                        errorHandler.manageAJAXError(error, next);
                    }
                    else {
                        if (facility && facility.id !== idFacility) {
                            errorHandler.manageAJAXError(30, next);
                        }
                        else if (facility && !facilityPic) {
                            errorHandler.manageAJAXError(40, next);
                        }
                        else {
                            // Actualizar instalación
                            this.daoFac.update(idFacility, request.body.name, facilityPic, (error) => {
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
                                            title: "Instalación actualizada",
                                            message: "La información de la instalación se ha actualizado con éxito"
                                        }                                        
                                    });
                                }
                            });
                        }
                    }
                });
            }
        }
        else {
            errorHandler.manageAJAXError(parseInt(errors.array()[0].msg), next);
        }
    }

    // Crear nuevo tipo instalación
    newType(request, response, next) {
        const errors = validationResult(request);
        if (errors.isEmpty()) {
            let pic = request.file;
            // Comprobar formato foto, si hay
            if (pic && (pic.mimetype !== "image/png" || pic.size > 64 * 1024)) {
                errorHandler.manageAJAXError(14, next);
            }
            else {
                let idUniversity = request.session.university.id;
                // Comprobar si ese tipo existe en esa universidad
                this.daoFac.readTypeByUniversity(request.body.name, idUniversity, (error) => {
                    if (error) {
                        errorHandler.manageAJAXError(error, next);
                    }
                    else {
                        let facilityTypePic = pic ? pic.buffer : null
                        // Crear el nuevo tipo
                        this.daoFac.createType(request.body.name, facilityTypePic, idUniversity, (error) => {
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
                                        title: "Tipo de instalación creado",
                                        message: "Se ha añadido un nuevo tipo con éxito, ahora ya puedes seleccionarlo."
                                    }
                                });
                            }
                        });
                    }
                });
            }
        }        
        else {
            errorHandler.manageAJAXError(parseInt(errors.array()[0].msg), next);
        }
    }
}

module.exports = FacilityController;