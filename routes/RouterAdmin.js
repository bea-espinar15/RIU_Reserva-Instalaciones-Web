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

    // Validar usuario
    RouterAdmin.post(
      "/validar",
      // ID no vacío 
      check("idUser", "1").notEmpty(),
      // ID es un número
      check("idUser", "-5").isNumeric(),
      useController.validate
    );

    // [TODO] Hacer admin
    RouterAdmin.post(
      "/hacerAdmin",
      useController.makeAdmin
    );

    // [TODO] Banear
    RouterAdmin.post(
      "/expulsar",
      useController.ban
    );

    // [TODO] Crear instalación
    RouterAdmin.post(
      "/crearInstalacion",
      facController.newFacility
    );

    // [TODO] Editar instalación
    RouterAdmin.post(
      "/editarInstalacion",
      facController.editFacility
    );

    // [TODO] Crear tipo de instalación
    RouterAdmin.post(
      "/crearTipo",
      facController.newType
    );

}

module.exports = {
    RouterAdmin: RouterAdmin,
    routerConfig: routerConfig
};