"use strict"

const utils = require("../utils");

class DAOMessages {
    // Constructor
    constructor(pool){
        this.pool = pool;

        this.readAll = this.readAll.bind(this);
        this.messagesUnread = this.messagesUnread.bind(this);
    }

    // Métodos

    // Leer todos
    readAll(idUser, callback) {
        this.pool.getConnection((error, connection) => {
            if (error) {
                callback(-1);
            }
            else {
                let querySQL = "SELECT MEN.*, USU.correo AS correoUsuarioOrigen FROM RIU_MEN_Mensaje AS MEN JOIN RIU_USU_Usuario AS USU ON MEN.id_usuario_origen = USU.id WHERE id_usuario_destino = ?";
                connection.query(querySQL, [idUser], (error, rows) => {
                    connection.release();
                    if (error) {
                        callback(-1);
                    }
                    else {
                        // Construir objeto
                        let messages = new Array();
                        rows.forEach(row => {
                            let message = {
                                id: row.id,
                                senderUsername: row.correoUsuarioOrigen,
                                message: row.mensaje,
                                subject: row.asunto,
                                sendDate: utils.formatDate(row.fecha_envío),
                                readDate: row.fecha_leído ? utils.formatDate(row.fecha_leído) : false
                            }
                            messages.push(message);
                        });
                        callback(null, messages);
                    }
                });
            }
        });
    }


    // Número de mensajes no leidos
    messagesUnread(idUser, callback) {
        this.pool.getConnection((error, connection) => {
            if (error) {
                callback(-1);
            }
            else {
                let querySQL = "SELECT COUNT(*) AS noLeidos FROM RIU_MEN_Mensaje AS MEN WHERE id_usuario_destino = ? AND fecha_leído IS NULL";
                connection.query(querySQL, [idUser], (error, rows) => {
                    connection.release();
                    if (error) {
                        callback(-1);
                    }
                    else {
                        if (rows.length != 1) {
                            callback(-1);
                        }
                        else {
                            let nUnreadMessages = rows[0].noLeidos
                            callback(null, nUnreadMessages);
                        }
                    }
                });
            }
        });
    }
}

module.exports = DAOMessages;