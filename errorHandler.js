"use strict"

function generateError(cod) {
    let code;
    let title; 
    let message;

    switch (cod) {
        // Errores mayores
        case -1: {
            code = 500;
            title = "Error con la Base de Datos";
            message = "Lo sentimos, se ha producido un error en la conexión con la Base de Datos. Por favor, vuelve a intentarlo en unos instantes.";
        } break;
        // Bad Request
        case 1: {
            code = 400;
            title = "Campos vacíos";
            message = "Asegúrate de rellenar todos los campos";
        } break;
        case 2: {
            code = 400;
            title = "Correo no válido";
            message = "Tu correo no pertenece a una universidad";
        } break;
        case 3: {
            code = 400;
            title = "Usuario no existente";
            message = "El correo introducido no está registrado o has sido expulsado. Debes crear una cuenta primero y ser validado.";
        } break;
        case 4: {
            code = 400;
            title = "No validado";
            message = "Aún no has sido validado por uno de los administradores de tu universidad. Este proceso no debería durar más de 24h, contacta con un superior si persiste el problema.";
        } break;
        case 5: {
            code = 400;
            title = "Contraseña no válida";
            message = "La contraseña introducida no es correcta";
        } break;
        default: {
            code = 500;
            title = "Error desconocido";
            message = "Lo sentimos, se ha producido un error desconocido";
        }
    }

    return {
        code: code,
        title: title,
        message: message
    }
}

function manageError(error, redirect, next) {
    let errorObj = generateError(error);
    // Error mayor
    if (error < 0) {
        next({
            ajax: false,
            status: errorObj.code,
            redirect: "error",
            data: errorObj
        });
    }
    // Bad Request
    else {
        next({
            ajax: false,
            status: errorObj.code,
            redirect: redirect,
            data: {
                error: errorObj 
            }
        });
    }
}

function manageAJAXError(error, next) {
    let errorObj = generateError(error);
    // Error mayor
    if (error < 0) {
        next({
            ajax: false,
            status: errorObj.code,
            redirect: "error",
            data: errorObj
        });
    }
    // Bad Request
    else {
        next({
            ajax: true,
            status: errorObj.code,
            error: errorObj
        });
    }
}

module.exports = {
    manageError: manageError,
    manageAJAXError: manageAJAXError
};