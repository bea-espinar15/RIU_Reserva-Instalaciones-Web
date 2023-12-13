"use strict"

// --- Importar módulos ---
// Core
const path = require("path");

// Paquete
const express = require("express");
const multer = require("multer");
const { check, validationResult } = require("express-validator");
const moment = require('moment');

// --- Multer ---
const multerFactory = multer({ storage: multer.memoryStorage() });

// --- Crear router ---
const RouterUser = express.Router();

// --- BodyParser (Express) ---
RouterUser.use(express.urlencoded({extended: true}));

// Obtener pool
function routerConfig(facController, mesController, resController, uniController, useController) {

    // --- Peticiones GET ---
    // Inicio
    RouterUser.get("/inicio", mesController.unreadMessages, facController.facilityTypes);

    // Instalaciones
    RouterUser.get(
        "/instalaciones/:id", 
        check("id", "-2").isNumeric(), 
        mesController.unreadMessages, 
        facController.facilitiesByType
    );

    // Reservas
    RouterUser.get("/reservas", mesController.unreadMessages, resController.userReservations);

    // --- Peticiones POST ---
    // Reservar
    RouterUser.post(
        "/reservar",
        // Ninguno de los campos vacíos 
        check("date", "1").notEmpty(),
        check("hour", "1").notEmpty(),
        check("idFacility", "1").notEmpty(),
        check("idFacilityType", "1").notEmpty(),
        check("nPeople", "1").notEmpty(),
        // Campos son números
        check("idFacility", "-4").isNumeric(),
        check("idFacilityType", "-4").isNumeric(),
        check("nPeople", "7").isNumeric(),
        // Nº personas > 0
        check("nPeople", "7").custom((nPeople) => { return nPeople > 0 }),
        // Comprobar que la fecha no cae en sábado o domingo
        check("date", "9").custom((date) => {
            let dateObj = new Date(date);
            return !(dateObj.getDay() === 0 || dateObj.getDay() === 6);
        }),   
        mesController.unreadMessages,     
        resController.reserve
    );
    
    // Cancelar reserva
    RouterUser.post(
      "/cancelar",
      // ID no vacío 
      check("idReservation", "1").notEmpty(),
      // ID es un número
      check("idReservation", "-6").isNumeric(),
      resController.cancel  
    );

}

module.exports = {
    RouterUser: RouterUser,
    routerConfig: routerConfig
};