"use strict"


const utils = require("../utils");

class DAOFacilities {
    // Constructor
    constructor(pool){
        this.pool = pool;

        this.readAll = this.readAll.bind(this);
        this.readAllTypes = this.readAllTypes.bind(this);
        this.readFacilitiesByType = this.readFacilitiesByType.bind(this);
        this.readFacilityTypePic = this.readFacilityTypePic.bind(this);
        this.readFacilityPic = this.readFacilityPic.bind(this);
    }

    // Métodos
    // Leer una instalación de una universidad
    read(idFacility, idUniversity, callback) {
        this.pool.getConnection((error, connection) => {
            if (error) {
                callback(-1);
            }
            else {
                let querySQL = "SELECT INS.* FROM RIU_INS_Instalación AS INS JOIN RIU_TIN_Tipo_Instalación AS TIN ON INS.id_tipo = TIN.id WHERE INS.id = ? AND TIN.id_universidad = ?";
                connection.query(querySQL, [idFacility, idUniversity], (error, rows) => {
                    connection.release();
                    if (error) {
                        callback(-1);
                    }
                    else {
                        if (rows.length === 0) {
                            callback(-4);
                        }
                        else {
                            let facility = {
                                id: rows[0].id,
                                name: rows[0].nombre,
                                startHour: utils.formatHour(rows[0].hora_ini),
                                endHour: utils.formatHour(rows[0].hora_fin),
                                complete: rows[0].completo,
                                reservationType: rows[0].tipo_reserva === 0 ? "Individual" : "Colectiva",
                                capacity: rows[0].aforo,
                                hasPic: rows[0].foto ? true : false,
                                idType: rows[0].id_tipo
                            }
                            callback(null, facility);
                        }                        
                    }
                });
            }
        });
    }

    // Leer todas las instalaciones
    readAll(idUniversity, callback) {
        this.pool.getConnection((error, connection) => {
            if (error) {
                callback(-1);
            }
            else {
                let querySQL = "SELECT INS.*, TIN.nombre AS nombreTipo"
                 + " FROM RIU_INS_Instalación AS INS JOIN RIU_TIN_Tipo_Instalación AS TIN ON INS.id_tipo = TIN.id WHERE TIN.id_universidad = ?";
                connection.query(querySQL, [idUniversity], (error, rows) => {
                    connection.release();
                    if (error) {
                        callback(-1);
                    }
                    else {
                        // Construir objeto
                        let facilities = new Array();
                        rows.forEach(row => {
                            let facility = {
                                id: row.id,
                                name: row.nombre,
                                startHour: utils.formatHour(row.hora_ini),
                                endHour: utils.formatHour(row.hora_fin),
                                complete: row.completo,
                                reservationType: row.tipo_reserva === 0 ? "Individual" : "Colectiva",
                                capacity: row.aforo,
                                hasPic: row.foto ? true : false,
                                idType: row.id_tipo,
                                facilityTypeName: row.nombreTipo
                            }
                            facilities.push(facility);
                        });
                        callback(null, facilities);
                    }
                });
            }
        });
    }

    // Leer todos los tipos
    readAllTypes(idUniversity, callback) {
        this.pool.getConnection((error, connection) => {
            if (error) {
                callback(-1);
            }
            else {
                let querySQL = "SELECT * FROM RIU_TIN_Tipo_Instalación AS TIN WHERE id_universidad = ?";
                connection.query(querySQL, [idUniversity], (error, rows) => {
                    connection.release();
                    if (error) {
                        callback(-1);
                    }
                    else {
                        // Construir objeto
                        let types = new Array();
                        rows.forEach(row => {
                            let type = {
                                id: row.id,
                                name: row.nombre,
                                hasPic: row.foto ? true : false,
                                idUniversity: row.id_universidad
                            }
                            types.push(type);
                        });
                        callback(null, types);
                    }
                });
            }
        });
    }

    // Leer instalaciones de un tipo
    readFacilitiesByType (idType, callback) {
        this.pool.getConnection((error, connection) => {
            if (error) {
                callback(-1);
            }
            else {
                let querySQL = "SELECT INS.*, TIN.nombre AS nombreTipo, TIN.foto AS fotoTipo FROM RIU_INS_Instalación AS INS JOIN RIU_TIN_Tipo_Instalación AS TIN ON INS.id_tipo = TIN.id WHERE TIN.id = ?";
                connection.query(querySQL, [idType], (error, rows) => {
                    connection.release();
                    if (error) {
                        callback(-1);
                    }
                    else {
                        // Construir objeto
                        let facilities = new Array();
                        rows.forEach(row => {
                            let facility = {
                                id: row.id,
                                name: row.nombre,
                                startHour: utils.formatHour(row.hora_ini),
                                endHour: utils.formatHour(row.hora_fin),
                                complete: row.completo,
                                reservationType: row.tipo_reserva === 0 ? "Individual" : "Colectiva",
                                capacity: row.aforo,
                                hasPic: row.foto ? true : false,
                                idType: row.id_tipo,
                                facilityTypeName: row.nombreTipo,
                                facilityTypeHasPic: (row.fotoTipo ? true : false)
                            }
                            facilities.push(facility);
                        });
                        callback(null, facilities);
                    }
                });
            }
        });
    }

    // Obtener foto de un tipo de instalación
    readFacilityTypePic(idFacilityType, callback) {
        this.pool.getConnection((error, connection) => {
            if (error) {
                callback(-1);
            }
            else {
                let querySQL = "SELECT foto FROM RIU_TIN_Tipo_Instalación AS TIN WHERE id = ?";
                connection.query(querySQL, [idFacilityType], (error, rows) => {
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
                            let pic = rows[0].foto;
                            callback(null, pic);
                        }
                    }
                });
            }
        });
    }

    // Obtener foto de una instalación
    readFacilityPic(idFacility, callback) {
        this.pool.getConnection((error, connection) => {
            if (error) {
                callback(-1);
            }
            else {
                let querySQL = "SELECT foto FROM RIU_INS_Instalación AS INS WHERE id = ?";
                connection.query(querySQL, [idFacility], (error, rows) => {
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
                            let pic = rows[0].foto;
                            callback(null, pic);
                        }
                    }
                });
            }
        });
    }
}

module.exports = DAOFacilities;