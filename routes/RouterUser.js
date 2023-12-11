"use strict"

// --- Importar módulos ---
// Core
const path = require("path");

// Paquete
const express = require("express");
const multer = require("multer");
const { check, validationResult } = require("express-validator");

// --- Multer ---
const multerFactory = multer({ storage: multer.memoryStorage() });

// --- Crear router ---
const RouterUser = express.Router();

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
    // [TODO]

}

module.exports = {
    RouterUser: RouterUser,
    routerConfig: routerConfig
};