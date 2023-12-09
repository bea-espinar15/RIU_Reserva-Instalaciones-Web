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
RouterPersonal.get("/correo", (request, response, next) => {
    response.render("mail", {
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
        messages: testData.messages,
        universityMail: testData.university.mail
    });
});

// [!] Perfil
RouterPersonal.get("/perfil", (request, response, next) => {
    response.render("profile", {
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
        user: testData.users[0],
        universityMail: testData.university.mail
    });
});

// --- Peticiones POST ---
// [TODO]

module.exports = RouterPersonal;