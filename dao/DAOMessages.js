"use strict"

class DAOMessages {
    // Constructor
    constructor(pool){
        this.pool = pool;

        this.messagesUnread = this.messagesUnread.bind(this);
    }

    // Métodos
    messagesUnread(idUser, callback) {
        this.pool.getConnection((error, connection) => {
            if (error) {
                callback(-1);
            }
            else {
                let querySQL = "SELECT COUNT(*) AS noLeidos FROM RIU_MEN_Mensaje AS MEN WHERE id_usuario_destino = ? AND fecha_leído = NULL";
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