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

// --- Peticiones GET ---
// [!] Inicio
RouterAdmin.get("/inicio", (request, response, next) => {
    response.render("admin_index", {
        error: undefined,
        generalInfo: {
            hasLogo: false,
            idUniversity: testData.university.id,
            name: testData.university.name,
            web: testData.university.web,
            address: testData.university.address,
            messagesUnread: 5,
            idUser: testData.users[0].id,
            hasProfilePic: false
        }
    });
});

// [!] Configuración
RouterAdmin.get("/configuracion", (request, response, next) => {
    response.render("admin_settings", {
        error: undefined,
        generalInfo: {
            hasLogo: false,
            idUniversity: testData.university.id,
            name: testData.university.name,
            web: testData.university.web,
            address: testData.university.address,
            messagesUnread: 5,
            idUser: testData.users[0].id,
            hasProfilePic: false
        },
        university: testData.university
    });
});

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
            hasProfilePic: false
        },
        users: testData.users
    });
});

// [!] Instalaciones
RouterAdmin.get("/instalaciones", (request, response, next) => {
    response.render("admin_facilities", {
        error: undefined,
        generalInfo: {
            hasLogo: false,
            idUniversity: testData.university.id,
            name: testData.university.name,
            web: testData.university.web,
            address: testData.university.address,
            messagesUnread: 5,
            idUser: testData.users[0].id,
            hasProfilePic: false
        },
        facilities: testData.facilities
    });
});

// [!] Reservas
RouterAdmin.get("/reservas", (request, response, next) => {
    response.render("admin_reservations", {
        error: undefined,
        generalInfo: {
            hasLogo: false,
            idUniversity: testData.university.id,
            name: testData.university.name,
            web: testData.university.web,
            address: testData.university.address,
            messagesUnread: 5,
            idUser: testData.users[0].id,
            hasProfilePic: false
        },
        reservations: testData.reservations
    });
});

// --- Peticiones POST ---
// [TODO]

module.exports = RouterAdmin;