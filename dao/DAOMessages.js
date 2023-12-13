"use strict"

const utils = require("../utils");

class DAOMessages {
    // Constructor
    constructor(pool){
        this.pool = pool;

        this.create = this.create.bind(this);
        this.read = this.read.bind(this);
        this.readAll = this.readAll.bind(this);
        this.messagesUnread = this.messagesUnread.bind(this);
        this.markAsRead = this.markAsRead.bind(this);
    }

    // Métodos
    // Crear
    create(newMessage, callback) {
        this.pool.getConnection((error, connection) => {
            if (error) {
                callback(-1);
            }
            else {
                let querySQL = "INSERT INTO RIU_MEN_Mensaje (id_usuario_origen, id_usuario_destino, mensaje, asunto) VALUES (?, ?, ?, ?)";
                connection.query(querySQL, [newMessage.idSender, newMessage.idReceiver, newMessage.message, newMessage.subject], (error, rows) => {
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

    // Leer todos
    read(idMessage, idUser, callback) {
        console.log(idMessage, idUser);
        this.pool.getConnection((error, connection) => {
            if (error) {
                callback(-1);
            }
            else {
                let querySQL = "SELECT * FROM RIU_MEN_Mensaje AS MEN WHERE id = ? AND id_usuario_destino = ?";
                connection.query(querySQL, [idMessage, idUser], (error, rows) => {
                    connection.release();
                    if (error) {
                        callback(-1);
                    }
                    else {
                        if (rows.length > 1) {
                            callback(-1);
                        }
                        else if (rows.length === 0) {
                            callback(-7);
                        }
                        else {
                            // Construir objeto
                            let message = {
                                id: rows[0].id,
                                senderUsername: rows[0].correoUsuarioOrigen,
                                message: rows[0].mensaje,
                                subject: rows[0].asunto,
                                sendDate: utils.formatDate(rows[0].fecha_envío),
                                readDate: rows[0].fecha_leído ? utils.formatDate(rows[0].fecha_leído) : false
                            }
                            callback(null, message);
                        }                        
                    }
                });
            }
        });
    }

    // Leer todos
    readAll(idUser, callback) {
        this.pool.getConnection((error, connection) => {
            if (error) {
                callback(-1);
            }
            else {
                let querySQL = "SELECT MEN.*, USU.correo AS correoUsuarioOrigen FROM RIU_MEN_Mensaje AS MEN JOIN RIU_USU_Usuario AS USU ON MEN.id_usuario_origen = USU.id WHERE id_usuario_destino = ? ORDER BY MEN.fecha_envío DESC";
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

    // Número de mensajes no leidos
    markAsRead(idMessage, callback) {
        this.pool.getConnection((error, connection) => {
            if (error) {
                callback(-1);
            }
            else {
                let querySQL = "UPDATE RIU_MEN_Mensaje SET fecha_leído = CURRENT_TIMESTAMP WHERE id = ?";
                connection.query(querySQL, [idMessage], (error, rows) => {
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

module.exports = DAOMessages;