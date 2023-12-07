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

// [!] BORRAR
const testData = require("./delete");

// --- Peticiones GET ---
// [!] Inicio
RouterUser.get("/inicio", (request, response, next) => {
    response.render("user_index", {
        error: undefined,
        navInfo: {
            logo: testData.university.logo,
            name: testData.university.name,
            web: testData.university.web,
            address: testData.university.address,
            messagesUnread: 5,
            profilePic: undefined
        },
        facilityTypes: testData.facilityTypes
    });
});

// [!] Instalaciones
RouterUser.get("/instalaciones", (request, response, next) => {
    response.render("user_facilities", {
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
RouterUser.get("/reservas", (request, response, next) => {
    response.render("user_reservations", {
        error: undefined,
        navInfo: {
            logo: testData.university.logo,
            name: testData.university.name,
            web: testData.university.web,
            address: testData.university.address,
            messagesUnread: 5,
            profilePic: undefined
        },
        currentReservations: testData.currentReservations,
        oldReservations: testData.oldReservations
    });
});

// --- Peticiones POST ---
// [TODO]

module.exports = RouterUser;