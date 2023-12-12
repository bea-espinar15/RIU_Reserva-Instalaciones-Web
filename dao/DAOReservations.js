"use strict"

const { query } = require("express");
const utils = require("../utils");

class DAOReservations {
    // Constructor
    constructor(pool){
        this.pool = pool;
        
        this.create = this.create.bind(this);
        this.readAll = this.readAll.bind(this);
        this.readAllByUser = this.readAllByUser.bind(this);
        this.readByUnique = this.readByUnique.bind(this);
        this.readByDateAndHour = this.readByDateAndHour.bind(this);
        this.filter = this.filter.bind(this);
        this.buildQuery = this.buildQuery.bind(this);
    }

    // Métodos
    // Crear reserva
    create(reservation, callback) {
        this.pool.getConnection((error, connection) => {
            if (error) {
                callback(-1);
            }
            else {
                let querySQL = "INSERT INTO RIU_RES_Reserva (id_usuario, id_instalación, n_personas, fecha, hora, cola) VALUES (?, ?, ?, ?, ?, ?)";
                connection.query(querySQL, [reservation.idUser, reservation.idFacility, reservation.nPeople, reservation.date, reservation.hour, reservation.queued], (error, row) => {
                    connection.release();
                    if (error) {
                        callback(-1);
                    }
                    else {
                        callback(null);
                    }
                });
            }
        });
    }

    // Leer todas
    readAll(idUniversity, callback) {
        this.pool.getConnection((error, connection) => {
            if (error) {
                callback(-1);
            }
            else {
                let querySQL = "SELECT RES.*, INS.nombre AS nombreInstalación, USU.correo AS correoUsuario"
                + " FROM ((RIU_RES_Reserva AS RES JOIN RIU_INS_Instalación AS INS ON RES.id_instalación = INS.id)"
                + " JOIN RIU_TIN_Tipo_Instalación AS TIN ON INS.id_tipo = TIN.id)"
                + " JOIN RIU_USU_Usuario AS USU ON RES.id_usuario = USU.id WHERE TIN.id_universidad = ? ORDER BY RES.fecha ASC, RES.hora ASC, USU.id ASC";
                connection.query(querySQL, [idUniversity], (error, rows) => {
                    connection.release();
                    if (error) {
                        callback(-1);
                    }
                    else {
                        // Construir objeto
                        let reservations = new Array();
                        rows.forEach(row => {
                            let reservation = {
                                id: row.id,
                                enabled: row.activo,
                                idUser: row.id_usuario,
                                idFacility: row.id_instalación,
                                nPeople: row.n_personas,
                                date: utils.formatDate(row.fecha),
                                hour: utils.formatHour(row.hora),
                                queued: row.cola ? true : false,
                                reservationDate: utils.formatDate(row.fecha_reserva),
                                facilityName: row.nombreInstalación,
                                userName: row.correoUsuario                                
                            }
                            reservations.push(reservation);
                        });
                        callback(null, reservations);
                    }
                });
            }
        });
    }

    // Leer reservas de un usuario
    readAllByUser(idUser, callback) {
        this.pool.getConnection((error, connection) => {
            if (error) {
                callback(-1);
            }
            else {
                let querySQL = "SELECT RES.*, INS.nombre AS nombreInstalación, INS.foto AS fotoInstalación, TIN.id AS idTipoInstalación, TIN.foto AS fotoTipoInstalación"
                + " FROM (RIU_RES_Reserva AS RES JOIN RIU_INS_Instalación AS INS ON RES.id_instalación = INS.id) JOIN RIU_TIN_Tipo_Instalación AS TIN ON INS.id_tipo = TIN.id"
                + " WHERE RES.id_usuario = ? ORDER BY RES.fecha ASC, RES.hora ASC, USU.id ASC";
                connection.query(querySQL, [idUser], (error, rows) => {
                    connection.release();
                    if (error) {
                        callback(-1);
                    }
                    else {
                        // Construir objeto
                        let reservations = new Array();
                        rows.forEach(row => {
                            let reservation = {
                                id: row.id,
                                enabled: row.activo,
                                idUser: row.id_usuario,
                                idFacility: row.id_instalación,
                                nPeople: row.n_personas,
                                date: utils.formatDate(row.fecha),
                                hour: utils.formatHour(row.hora),
                                queued: row.cola ? true : false,
                                reservationDate: utils.formatDate(row.fecha_reserva),
                                facilityName: row.nombreInstalación,
                                hasPic: row.fotoInstalación ? true : false,
                                idFacilityType: row.idTipoInstalación,
                                typeHasPic: row.fotoTipoInstalación ? true : false
                            }
                            reservations.push(reservation);
                        });
                        callback(null, reservations);
                    }
                });
            }
        });
    }

    // Leer reservas realizadas en un momento
    readByUnique(idUser, idFacility, date, hour, callback) {
        this.pool.getConnection((error, connection) => {
            if (error) {
                callback(-1);
            }
            else {
                let querySQL = "SELECT * FROM RIU_RES_Reserva AS RES WHERE id_usuario = ? AND id_instalación = ? AND fecha = ? AND hora = ? AND activo = 1";
                connection.query(querySQL, [idUser, idFacility, date, hour], (error, rows) => {
                    connection.release();
                    if (error) {
                        callback(-1);
                    }
                    else {
                        if (rows.length > 1) {
                            callback(-1);
                        }
                        else if (rows.length === 0) {
                            callback(null, null);
                        }
                        else {
                            // Construir objeto
                            let reservation = {
                                id: rows[0].id,
                                enabled: rows[0].activo,
                                idUser: rows[0].id_usuario,
                                idFacility: rows[0].id_instalación,
                                nPeople: rows[0].n_personas,
                                date: utils.formatDate(rows[0].fecha),
                                hour: utils.formatHour(rows[0].hora),
                                queued: rows[0].cola ? true : false,
                                reservationDate: utils.formatDate(rows[0].fecha_reserva)
                            }
                            callback(null, reservation);
                        }    
                    }
                });
            }
        });
    }

    // Leer reservas realizadas en un momento
    readByDateAndHour(date, hour, idFacility, callback) {
        this.pool.getConnection((error, connection) => {
            if (error) {
                callback(-1);
            }
            else {
                let querySQL = "SELECT * FROM RIU_RES_Reserva AS RES WHERE fecha = ? AND hora = ? AND id_instalación = ?";
                connection.query(querySQL, [date, hour, idFacility], (error, rows) => {
                    connection.release();
                    if (error) {
                        callback(-1);
                    }
                    else {
                        // Construir objeto
                        let reservations = new Array();
                        rows.forEach(row => {
                            let reservation = {
                                id: row.id,
                                enabled: row.activo,
                                idUser: row.id_usuario,
                                idFacility: row.id_instalación,
                                nPeople: row.n_personas,
                                date: utils.formatDate(row.fecha),
                                hour: utils.formatHour(row.hora),
                                queued: row.cola ? true : false,
                                reservationDate: utils.formatDate(row.fecha_reserva)
                            }
                            reservations.push(reservation);
                        });
                        callback(null, reservations);
                    }
                });
            }
        });
    }

    // Filtrar
    filter(filters, callback) {
        this.pool.getConnection((error, connection) => {
            if (error) {
                callback(-1);
            }
            else {
                let params = new Array();
                let where = "";
                // Construir condiciones
                let res = this.buildQuery(filters.user, where);
                if (res[0]) {
                    for (let i = 0; i < 4; ++i) {
                        params.push("%" + filters.user + "%");
                    }                    
                    where = where + res[1] + "(USU.nombre LIKE ? OR USU.apellido1 LIKE ? OR USU.apellido2 LIKE ? OR USU.correo LIKE ?)";
                }
                res = this.buildQuery(filters.date, where);
                if (res[0]) {
                    params.push(filters.date);
                    where = where + res[1] + "RES.fecha = ?";
                }
                res = this.buildQuery(filters.faculty, where);
                if (res[0]) {
                    params.push(filters.faculty);
                    where = where + res[1] + "FAC.nombre = ?";
                }
                res = this.buildQuery(filters.facilityName, where);
                if (res[0]) {
                    params.push("%" + filters.facilityName + "%");
                    where = where + res[1] + "INS.nombre LIKE ?";
                }

                let querySQL = "SELECT RES.*, INS.nombre AS nombreInstalación, USU.correo AS correoUsuario"
                + " FROM ((RIU_RES_Reserva AS RES JOIN RIU_INS_Instalación AS INS ON RES.id_instalación = INS.id) JOIN RIU_USU_Usuario AS USU ON RES.id_usuario = USU.id)"
                + " JOIN RIU_FAC_Facultad AS FAC ON USU.id_facultad = FAC.id"
                + where + " ORDER BY RES.fecha ASC, RES.hora ASC, USU.id ASC";

                connection.query(querySQL, params, (error, rows) => {
                    connection.release();
                    if (error) {
                        callback(-1);
                    }
                    else {
                        // Construir objeto
                        let reservations = new Array();
                        rows.forEach(row => {
                            let reservation = {
                                id: row.id,
                                enabled: row.activo,
                                idUser: row.id_usuario,
                                idFacility: row.id_instalación,
                                nPeople: row.n_personas,
                                date: utils.formatDate(row.fecha),
                                hour: utils.formatHour(row.hora),
                                queued: row.cola ? true : false,
                                reservationDate: utils.formatDate(row.fecha_reserva),
                                facilityName: row.nombreInstalación,
                                userName: row.correoUsuario 
                            }
                            reservations.push(reservation);
                        });
                        callback(null, reservations);
                    }
                });
            }
        });
    }

    // Constuir WHERE del filter
    buildQuery(filter, where) {
        if (filter != "") {
            if (where === "") {
                return [true, " WHERE "];
            }
            if (where === " WHERE ") {
                return [true, ""];
            }
            else {
                return [true, " AND "];
            }
        }
        else {
            return [false, ""];
        }        
    } 

}

module.exports = DAOReservations;