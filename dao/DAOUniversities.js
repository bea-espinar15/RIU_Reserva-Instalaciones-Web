"use strict"

const { query } = require("express");

class DAOUniversities {
    // Constructor
    constructor(pool) {
        this.pool = pool;

        this.readAll = this.readAll.bind(this);
        this.readByMail = this.readByMail.bind(this);
        this.readPic = this.readPic.bind(this);
        this.readAllFaculties = this.readAllFaculties.bind(this);
        this.changeSettings = this.changeSettings.bind(this);
    }

    // Métodos
    // Leer todo
    readAll(callback) {
        this.pool.getConnection((error, connection) => {
            if (error) {
                callback(-1);
            }
            else {
                let querySQL = "SELECT * FROM RIU_UNI_Universidad AS UNI";
                connection.query(querySQL, (error, rows) => {
                    connection.release();
                    if (error) {
                        callback(-1);
                    }
                    else {
                        // Construir respuesta
                        let universities = new Array();
                        rows.forEach((row) => {
                            let uni = {
                                id: row.id,
                                name: row.nombre,
                                web: row.web,
                                address: row.dirección,
                                mail: row.correo,
                                hasLogo: row.logo ? true : false
                            }
                            universities.push(uni);
                        });
                        callback(null, universities);
                    }
                });
            }
        });
    }

    // Obtener universidad a partir de su correo
    readByMail(mail, callback) {
        this.pool.getConnection((error, connection) => {
            if (error) {
                callback(-1);
            }
            else {
                let querySQL = "SELECT * FROM RIU_UNI_Universidad AS UNI WHERE correo = ?";
                connection.query(querySQL, [mail], (error, rows) => {
                    connection.release();
                    if (error) {
                        callback(-1);
                    }
                    else {
                        if (rows.length != 1) {
                            callback(-1);
                        }
                        else {
                            // Construir objeto
                            let university = {
                                id: rows[0].id,
                                name: rows[0].nombre,
                                web: rows[0].web,
                                address: rows[0].dirección,
                                mail: rows[0].correo,
                                hasLogo: rows[0].logo ? true : false
                            }
                            callback(null, university);
                        }
                    }
                });
            }
        });
    }

    // Obtener foto de la universidad
    readPic(idUniversity, callback) {
        this.pool.getConnection((error, connection) => {
            if (error) {
                callback(-1);
            }
            else {
                let querySQL = "SELECT logo FROM RIU_UNI_Universidad AS UNI WHERE id = ?";
                connection.query(querySQL, [idUniversity], (error, rows) => {
                    connection.release();
                    if (error) {
                        callback(-1);
                    }
                    else {
                        if (rows.length != 1) {
                            callback(-1);
                        }
                        else {
                            // Construir objeto
                            let pic = rows[0].logo;
                            callback(null, pic);
                        }
                    }
                });
            }
        });
    }

    // Leer todas las facultades de una universidad
    readAllFaculties(mail, callback) {
        this.pool.getConnection((error, connection) => {
            if (error) {
                callback(-1);
            }
            else {
                let querySQL = "SELECT FAC.* FROM RIU_FAC_Facultad AS FAC JOIN RIU_UNI_Universidad AS UNI ON FAC.id_universidad = UNI.id WHERE correo = ?";
                connection.query(querySQL, [mail], (error, rows) => {
                    connection.release();
                    if (error) {
                        callback(-1);
                    }
                    else {
                        if (rows.length === 0) {
                            callback(-1);
                        }
                        else {
                            // Construir objeto
                            let faculties = new Array();
                            rows.forEach((row) => {
                                let faculty = {
                                    id: row.id,
                                    name: row.nombre,
                                    idUniversity: row.id_universidad
                                };
                                faculties.push(faculty);
                            });
                            
                            callback(null, faculties);
                        }
                    }
                });
            }
        });
    }

    // Cambiar parámetros universidad
    changeSettings(newSettings, callback) {
        this.pool.getConnection((error, connection) => {
            if (error) {
                callback(-1);
            }
            else {
                // Si no se ha modificado la foto, no se actualiza
                let changePic = ", logo = ?";
                let where = " WHERE id = ?"
                let querySQL = "UPDATE RIU_UNI_Universidad SET nombre = ?, web = ?, dirección = ?";
                let params = [newSettings.name, newSettings.web, newSettings.address, newSettings.idUniversity];
                if (newSettings.pic) { 
                    querySQL += changePic; 
                    params.splice(3, 0, newSettings.pic);
                }
                querySQL += where;
                // Ejecutar query
                connection.query(querySQL, params, (error, rows) => {
                    connection.release();
                    if (error) {
                        callback(-1);
                    }
                    else {
                        if (rows.affectedRows === 0) {
                            callback(-1);
                        }
                        else {
                            callback(null);
                        }
                    }
                });
            }
        });
    }
}

module.exports = DAOUniversities;