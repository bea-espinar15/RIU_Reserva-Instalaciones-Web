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

    // [TODO] Editar foto de perfil
    RouterPersonal.post(
        "/editarFotoPerfil",
        useController.editProfilePic
    );

    // [TODO] Cambiar contraseña
    RouterPersonal.post(
        "/cambiarContrasena",
        useController.changePassword
    );

}

module.exports = {
    RouterPersonal: RouterPersonal,
    routerConfig: routerConfig
};