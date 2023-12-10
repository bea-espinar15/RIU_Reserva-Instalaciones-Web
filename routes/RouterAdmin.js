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
const RouterAdmin = express.Router();

// Obtener pool
function routerConfig(facController, mesController, resController, uniController, useController) {

    // --- Peticiones GET ---
    // Inicio
    RouterAdmin.get("/inicio", mesController.adminIndex);

    // Configuración
    RouterAdmin.get("/configuracion", mesController.adminSettings);

    // Usuarios
    RouterAdmin.get("/usuarios", useController.users);

    // Instalaciones
    RouterAdmin.get("/instalaciones", facController.facilities);

    // Reservas
    RouterAdmin.get("/reservas", resController.reservations);

    // --- Peticiones POST ---
    // [TODO]

}

module.exports = {
    RouterAdmin: RouterAdmin,
    routerConfig: routerConfig
};