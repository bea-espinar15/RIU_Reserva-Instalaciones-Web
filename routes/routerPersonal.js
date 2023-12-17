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

// Variables globales
const passwordRegex = /(?=.*[A-Za-z])(?=.*\d).{8,}/;

// Obtener pool
function routerConfig(facController, mesController, resController, uniController, useController) {

    // --- Peticiones GET ---
    // Mensajes
    RouterPersonal.get("/correo", mesController.mails);

    // Perfil
    RouterPersonal.get("/perfil", mesController.unreadMessages, useController.profile);

    // --- Peticiones POST ---
    // Enviar mensaje
    RouterPersonal.post(
        "/enviarMensaje",
        // Mensaje no vacío
        check("message", "1").notEmpty(),
        // Correo no vacío
        check("mail", "1").notEmpty(),
        // No hay @
        check("mail", "22").custom((mail) => {
            return !mail.includes("@");
        }),
        mesController.sendMessage
    );

    RouterPersonal.post(
        "/marcarLeido",
        // ID no vacío 
        check("idMessage", "1").notEmpty(),
        // ID es un número
        check("idMessage", "-7").isNumeric(),
        mesController.markAsRead
    );

    // Editar foto de perfil
    RouterPersonal.post(
        "/editarFotoPerfil",
        multerFactory.single("profilePic"),
        useController.editProfilePic
    );

    // Cambiar contraseña
    RouterPersonal.post(
        "/cambiarContrasena",
        // Campos no vacíos
        check("oldPass", "1").notEmpty(),
        check("newPass", "1").notEmpty(),
        // Nueva contraseña cumple requisitos
        check("newPass", "15").custom((pass) => {
            return passwordRegex.test(pass);
        }),
        useController.changePassword
    );

}

module.exports = {
    RouterPersonal: RouterPersonal,
    routerConfig: routerConfig
};