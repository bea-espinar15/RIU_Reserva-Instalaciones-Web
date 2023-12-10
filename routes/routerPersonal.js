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
const RouterPersonal = express.Router();

// Obtener pool
function routerConfig(facController, mesController, resController, uniController, useController) {

    // --- Peticiones GET ---
    // Mensajes
    RouterPersonal.get("/correo", mesController.mails);

    // Perfil
    RouterPersonal.get("/perfil", mesController.profile);

    // --- Peticiones POST ---
    // [TODO]

}

module.exports = {
    RouterPersonal: RouterPersonal,
    routerConfig: routerConfig
};