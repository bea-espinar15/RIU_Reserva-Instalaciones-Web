"use strict"

class DAOFacilities {
    // Constructor
    constructor(pool){
        this.pool = pool;

        this.readAllTypes = this.readAllTypes.bind(this);
    }

    // Métodos
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