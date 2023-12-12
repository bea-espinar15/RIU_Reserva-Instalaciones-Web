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
    RouterAdmin.get("/inicio", mesController.unreadMessages, useController.adminIndex);

    // Configuración
    RouterAdmin.get("/configuracion", mesController.unreadMessages, uniController.adminSettings);

    // Usuarios
    RouterAdmin.get("/usuarios",  mesController.unreadMessages, useController.users);

    // Instalaciones
    RouterAdmin.get("/instalaciones", mesController.unreadMessages, facController.facilities);

    // Reservas
    RouterAdmin.get("/reservas", mesController.unreadMessages, resController.reservations);

    // --- Peticiones POST ---
    // Cambiar configuración
    RouterAdmin.post(
      "/cambiarConfiguracion",
      multerFactory.single("settingsPic"),       
      // Ninguno de los campos vacíos 
      check("settingsName", "1").notEmpty(),
      check("settingsAddress", "1").notEmpty(),
      check("settingsWeb", "1").notEmpty(),
      // Regex web correcto
      check("settingsWeb", "13").isURL(),
      mesController.unreadMessages,  
      uniController.changeSettings  
    );
    
    // Filtrar reservas
    RouterAdmin.post("/filtrarReservas", mesController.unreadMessages, resController.filter);

    // [TODO]

}

module.exports = {
    RouterAdmin: RouterAdmin,
    routerConfig: routerConfig
};