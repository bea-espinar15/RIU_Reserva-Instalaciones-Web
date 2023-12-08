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

// [!] BORRAR
const testData = require("../delete");

// --- Peticiones GET ---
// [!] Mensajes
RouterPersonal.get("/mensajes", (request, response, next) => {
    response.render("mail", {
        error: undefined,
        navInfo: {
            logo: testData.university.logo,
            name: testData.university.name,
            web: testData.university.web,
            address: testData.university.address,
            messagesUnread: 5,
            profilePic: undefined
        },
        messages: testData.messages
        
    });
});

// [!] Perfil
RouterPersonal.get("/perfil", (request, response, next) => {
    response.render("profile", {
        error: undefined,
        navInfo: {
            logo: testData.university.logo,
            name: testData.university.name,
            web: testData.university.web,
            address: testData.university.address,
            messagesUnread: 5,
            profilePic: undefined
        },
        user: testData.users[0]
    });
});

// --- Peticiones POST ---
// [TODO]

module.exports = RouterPersonal;