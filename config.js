"use strict"

module.exports = {
    config: {
        host: "localhost",
        user: "root",
        pass: "",
        database: "UCM_RIU",
        port: 3306,
        // Borrado de sesiones
        clearExpired: true, // Eliminar automáticamente las sesiones expiradas
        checkExpirationInterval: 1800000, // Cada cuanto se borran las sesiones (30 min)
        ttl: 24 * 60 * 60 // Una sesión expira cada 24h
    },
    port: 3000
}