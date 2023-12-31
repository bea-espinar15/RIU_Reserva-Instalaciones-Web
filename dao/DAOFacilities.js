"use strict"

const utils = require("../utils");

class DAOFacilities {
    // Constructor
    constructor(pool){
        this.pool = pool;

        this.create = this.create.bind(this);
        this.createType = this.createType.bind(this);
        this.read = this.read.bind(this);
        this.readByUniversity = this.readByUniversity.bind(this);
        this.readByType = this.readByType.bind(this);
        this.readAll = this.readAll.bind(this);
        this.readAllTypes = this.readAllTypes.bind(this);
        this.readAllValidTypes = this.readAllValidTypes.bind(this);
        this.readFacilitiesByType = this.readFacilitiesByType.bind(this);
        this.readTypeByUniversity = this.readTypeByUniversity.bind(this);
        this.readFacilityTypePic = this.readFacilityTypePic.bind(this);
        this.readFacilityPic = this.readFacilityPic.bind(this);
        this.update = this.update.bind(this);
    }

    // Métodos
    // Crear nueva instalación
    create(newFacility, callback) {
        this.pool.getConnection((error, connection) => {
            if (error) {
                callback(-1);
            }
            else {
                let querySQL = "INSERT INTO RIU_INS_Instalación (nombre, hora_ini, hora_fin, tipo_reserva, aforo, foto, id_tipo) VALUES (?, ?, ?, ?, ?, ?, ?)";
                connection.query(querySQL, [newFacility.name, newFacility.startHour, newFacility.endHour, newFacility.reservationType, newFacility.capacity, newFacility.facilityPic, newFacility.idFacilityType], (error, rows) => {
                    connection.release();
                    if (error) {
                        callback(-1);
                    }
                    else {
                        if (rows.affectedRows != 1) {
                            callback(-1);
                        }
                        else {
                            callback(null, rows.insertId);
                        }
                    }
                });
            }
        });
    }

    // Crear nuevo tipo de instalación
    createType(name, pic, idUniversity, callback) {
        this.pool.getConnection((error, connection) => {
            if (error) {
                callback(-1);
            }
            else {
                let querySQL = "INSERT INTO RIU_TIN_Tipo_Instalación (nombre, foto, id_universidad) VALUES (?, ?, ?)";
                connection.query(querySQL, [name, pic, idUniversity], (error, rows) => {
                    connection.release();
                    if (error) {
                        callback(-1);
                    }
                    else {
                        if (rows.affectedRows != 1) {
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
    
    // Leer
    read(idFacility, callback) {
        this.pool.getConnection((error, connection) => {
            if (error) {
                callback(-1);
            }
            else {
                let querySQL = "SELECT * FROM RIU_INS_Instalación WHERE id = ?";
                connection.query(querySQL, [idFacility], (error, rows) => {
                    connection.release();
                    if (error) {
                        callback(-1);
                    }
                    else {
                        if (rows.length > 1) {
                            callback(-1);
                        }
                        else if (rows.length === 0) {
                            callback(-8);
                        }
                        else {
                            let facility = {
                                id: rows[0].id,
                                name: rows[0].nombre,
                                startHour: utils.formatHour(rows[0].hora_ini),
                                endHour: utils.formatHour(rows[0].hora_fin),
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

    // Leer una instalación de una universidad
    readByUniversity(idFacility, idUniversity, callback) {
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

    // Leer una instalación por tipo
    readByType(facilityName, idType, callback) {
        this.pool.getConnection((error, connection) => {
            if (error) {
                callback(-1);
            }
            else {
                let querySQL = "SELECT * FROM RIU_INS_Instalación WHERE nombre = ? AND id_tipo = ?";
                connection.query(querySQL, [facilityName, idType], (error, rows) => {
                    connection.release();
                    if (error) {
                        callback(-1);
                    }
                    else {
                        if (rows.length > 1) {
                            callback(-4);
                        }
                        else if (rows.length === 0) {
                            callback(null, null);
                        }
                        else {
                            // Construir objeto
                            let facility = {
                                id: rows[0].id,
                                name: rows[0].nombre,
                                startHour: utils.formatHour(rows[0].hora_ini),
                                endHour: utils.formatHour(rows[0].hora_fin),
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

    // Leer todos los tipos que tengan al menos una instalación
    readAllValidTypes (idUniversity, callback) {
        this.pool.getConnection((error, connection) => {
            if (error) {
                callback(-1);
            }
            else {
                let querySQL = "SELECT TIN.* FROM RIU_TIN_Tipo_Instalación AS TIN JOIN RIU_INS_Instalación AS INS ON TIN.id = INS.id_tipo WHERE id_universidad = ? GROUP BY TIN.nombre";
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
    readFacilitiesByType(idType, callback) {
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

    // Leer tipo por universidad
    readTypeByUniversity(name, idUniversity, callback) {
        this.pool.getConnection((error, connection) => {
            if (error) {
                callback(-1);
            }
            else {
                let querySQL = "SELECT * FROM RIU_TIN_Tipo_Instalación AS TIN WHERE nombre = ? AND id_universidad = ?";
                connection.query(querySQL, [name, idUniversity], (error, rows) => {
                    connection.release();
                    if (error) {
                        callback(-1);
                    }
                    else {
                        if (rows.length > 1) {
                            callback(-1);
                        }
                        else if (rows.length === 0) {
                            callback(null);
                        }
                        else {
                            callback(41);
                        }
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

    // Actualizar
    update(idFacility, name, pic, callback) {
        this.pool.getConnection((error, connection) => {
            if (error) {
                callback(-1);
            }
            else {
                let querySQL = "UPDATE RIU_INS_Instalación SET nombre = ?, foto = ? WHERE id = ?";
                connection.query(querySQL, [name, pic, idFacility], (error, rows) => {
                    connection.release();
                    if (error) {
                        callback(-1);
                    }
                    else {
                        if (rows.affectedRows != 1) {
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

module.exports = DAOFacilities;