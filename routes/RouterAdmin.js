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
        navInfo: {
            logo: testData.university.logo,
            name: testData.university.name,
            web: testData.university.web,
            address: testData.university.address,
            messagesUnread: 5,
            profilePic: undefined
        }
    });
});

// [!] Configuración
RouterAdmin.get("/configuracion", (request, response, next) => {
    response.render("admin_settings", {
        error: undefined,
        navInfo: {
            logo: testData.university.logo,
            name: testData.university.name,
            web: testData.university.web,
            address: testData.university.address,
            messagesUnread: 5,
            profilePic: undefined
        },
        university: testData.university
    });
});

// [!] Usuarios
RouterAdmin.get("/usuarios", (request, response, next) => {
    response.render("admin_users", {
        error: undefined,
        navInfo: {
            logo: testData.university.logo,
            name: testData.university.name,
            web: testData.university.web,
            address: testData.university.address,
            messagesUnread: 5,
            profilePic: undefined
        },
        users: testData.users
    });
});

// [!] Instalaciones
RouterAdmin.get("/instalaciones", (request, response, next) => {
    response.render("admin_facilities", {
        error: undefined,
        navInfo: {
            logo: testData.university.logo,
            name: testData.university.name,
            web: testData.university.web,
            address: testData.university.address,
            messagesUnread: 5,
            profilePic: undefined
        },
        facilities: testData.facilities
    });
});

// [!] Reservas
RouterAdmin.get("/reservas", (request, response, next) => {
    response.render("admin_reservations", {
        error: undefined,
        navInfo: {
            logo: testData.university.logo,
            name: testData.university.name,
            web: testData.university.web,
            address: testData.university.address,
            messagesUnread: 5,
            profilePic: undefined
        },
        reservations: testData.reservations
    });
});

// --- Peticiones POST ---
// [TODO]

module.exports = RouterAdmin;