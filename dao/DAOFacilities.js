"use strict"

const utils = require("../utils");

class DAOFacilities {
    // Constructor
    constructor(pool){
        this.pool = pool;

        this.readAllTypes = this.readAllTypes.bind(this);
    }

    // Métodos
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
}

module.exports = DAOFacilities;