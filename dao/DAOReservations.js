"use strict"

const utils = require("../utils");

class DAOReservations {
    // Constructor
    constructor(pool){
        this.pool = pool;
    }

    // Métodos
    // Leer todas
    readAll(idUniversity, callback) {
        this.pool.getConnection((error, connection) => {
            if (error) {
                callback(-1);
            }
            else {
                let querySQL = "SELECT RES.*, INS.nombre AS nombreInstalación, USU.correo AS correoUsuario FROM ((RIU_RES_Reserva AS RES JOIN RIU_INS_Instalación AS INS ON RES.id_instalación = INS.id)"
                + " JOIN RIU_TIN_Tipo_Instalación AS TIN ON INS.id_tipo = TIN.id)"
                + " JOIN RIU_USU_Usuario AS USU ON RES.id_usuario = USU.id WHERE TIN.id_universidad = ?";
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

}

module.exports = DAOReservations;