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

// [!] BORRAR
const testData = require("../delete");

// Obtener pool
function routerConfig(facController, mesController, resController, uniController, useController) {

    // --- Peticiones GET ---
    // Inicio
    RouterAdmin.get("/inicio", mesController.adminIndex);

    // Configuración
    RouterAdmin.get("/configuracion", mesController.adminSettings);

    // [!] Usuarios
    RouterAdmin.get("/usuarios", (request, response, next) => {
        response.render("admin_users", {
            error: undefined,
            generalInfo: {
                hasLogo: false,
                idUniversity: testData.university.id,
                name: testData.university.name,
                web: testData.university.web,
                address: testData.university.address,
                messagesUnread: 5,
                idUser: testData.users[0].id,
                hasProfilePic: false,
                isAdmin: true
            },
            users: testData.users,
            admins: testData.admins,
            universityMail: testData.university.mail
        });
    });

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