"use strict"

class DAOUsers {
    // Constructor
    constructor(pool) {
        this.pool = pool;

        this.read = this.read.bind(this);
        this.readAll = this.readAll.bind(this);
        this.readByUniversity = this.readByUniversity.bind(this);
        this.readPic = this.readPic.bind(this);
    }
    
    // Métodos
    // Obtener usuario
    read(idUser, callback) {
        this.pool.getConnection((error, connection) => {
            if (error) {
                callback(-1);
            }
            else {
                let querySQL = "SELECT * FROM RIU_USU_Usuario AS USU WHERE id = ?";
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
                            // Construir objeto
                            let user = {
                                id: rows[0].id,
                                enabled: rows[0].activo,
                                validated: rows[0].validado,
                                name: rows[0].nombre,
                                lastname1: rows[0].apellido1,
                                lastname2: rows[0].apellido2,
                                mail: rows[0].correo,
                                password: rows[0].contraseña,
                                hasProfilePic: (rows[0].foto ? true : false),
                                rol: rows[0].rol,
                                idFaculty: rows[0].id_facultad
                            }
                            callback(null, user);
                        }
                    }
                });
            }
        });
    }

    // Leer todos los usuarios (de una universidad)
    readAll(idUniversity, callback) {
        this.pool.getConnection((error, connection) => {
            if (error) {
                callback(-1);
            }
            else {
                let querySQL = "SELECT USU.*, FAC.nombre AS nombreFacultad FROM RIU_USU_Usuario AS USU JOIN RIU_FAC_Facultad AS FAC ON USU.id_facultad = FAC.id WHERE FAC.id_universidad = ?"
                connection.query(querySQL, [idUniversity], (error, rows) => {
                    connection.release();
                    if (error) {
                        callback(-1);
                    }
                    else {
                        let users = new Array();
                        rows.forEach(row => {
                            let user = {
                                id: row.id,
                                enabled: row.activo,
                                validated: row.validado,
                                name: row.nombre,
                                lastname1: row.apellido1,
                                lastname2: row.apellido2,
                                mail: row.correo,
                                hasProfilePic: row.foto ? true : false,
                                rol: row.rol,
                                idFaculty: row.id_facultad,
                                facultyName: row.nombreFacultad
                            };
                            users.push(user);
                        });
                        callback(null, users);
                    }
                });
            }
        });
    }

    // Leer usuario (por universidad)
    readByUniversity(userMail, idUniversity, callback) {
        this.pool.getConnection((error, connection) => {
            if (error) {
                callback(-1);
            }
            else {
                let querySQL = "SELECT USU.* FROM RIU_USU_Usuario AS USU JOIN RIU_FAC_Facultad AS FAC ON USU.id_facultad = FAC.id WHERE activo = 1 AND USU.correo = ? AND FAC.id_universidad = ?";
                connection.query(querySQL, [userMail, idUniversity], (error, rows) => {
                    connection.release();
                    if (error) {
                        callback(-1);
                    }
                    else {
                        if (rows.length > 1) {
                            callback(-1);
                        }
                        else if (rows.length === 0) {
                            callback(3);
                        }
                        else {
                            // Construir objeto
                            let user = {
                                id: rows[0].id,
                                enabled: rows[0].activo,
                                validated: rows[0].validado,
                                name: rows[0].nombre,
                                lastname1: rows[0].apellido1,
                                lastname2: rows[0].apellido2,
                                mail: rows[0].correo,
                                password: rows[0].contraseña,
                                hasProfilePic: (rows[0].foto ? true : false),
                                rol: rows[0].rol,
                                idFaculty: rows[0].id_facultad
                            }
                            callback(null, user);
                        }
                    }
                });
            }
        });
    }

    // Obtener foto de un usuario
    readPic(idUser, callback) {
        this.pool.getConnection((error, connection) => {
            if (error) {
                callback(-1);
            }
            else {
                let querySQL = "SELECT foto FROM RIU_USU_Usuario AS USU WHERE id = ?";
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

module.exports = DAOUsers;