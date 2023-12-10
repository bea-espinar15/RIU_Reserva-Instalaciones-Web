"use strict"

class DAOUniversities {
    // Constructor
    constructor(pool) {
        this.pool = pool;

        this.readAll = this.readAll.bind(this);
        this.readByMail = this.readByMail.bind(this);
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
}

module.exports = DAOUniversities;