"use strict"

class DAOUsers {
    // Constructor
    constructor(pool) {
        this.pool = pool;

        this.readByUniversity = this.readByUniversity.bind(this);
    }
    
    // Métodos
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
                                hasProfilPic: rows[0].foto ? true : false,
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
}

module.exports = DAOUsers;