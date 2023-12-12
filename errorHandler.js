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
        case -2: {
            code = 400;
            title = "Petición incorrecta";
            message = "Esta dirección no es válida.";
        } break;
        case -3: {
            code = 403;
            title = "Acceso no premitido";
            message = "No sé a dónde estabas intentando acceder, pero no puedes!";
        } break;
        case -4: {
            code = 403;
            title = "Instalación no válida";
            message = "No tienes permiso para reservar esta instalación (o no existe)";
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
        case 6: {
            code = 403;
            title = "Acceso no permitido";
            message = "Has sido baneado de la aplicación por un administrados. Si crees que ha sido un problema, contacta con un superior de tu universidad.";
        } break;
        case 7: {
            code = 400;
            title = "Nº personas no válido";
            message = "Recuerda introducir un número de personas válido y que sea menor o igual que el aforo de la instalación que deseas reservar.";
        } break;
        case 8: {
            code = 400;
            title = "Fecha y hora no válidas";
            message = "La reserva debe realizarse en un día (y hora) posterior a este momento.";
        } break;
        case 9: {
            code = 400;
            title = "Fecha no válida";
            message = "Las instalaciones no están disponibles los fines de semana.";
        } break;
        case 10: {
            code = 400;
            title = "Demasiadas personas";
            message = "La instalación no tiene aforo suficiente para las personas que has solicitado.";
        } break;
        case 11: {
            code = 400;
            title = "Hora no válida";
            message = "La hora no está incluida en el rango disponible para esta instalación.";
        } break;
        case 12: {
            code = 400;
            title = "Reserva fallida";
            message = "Ya habías realizado una reserva de esta instalación en el día y la hora indicados. Si deseas modificar la que hiciste, deberás cancelarala y volver a realizarla, pero se te sacará de la cola.";
        } break;
        case 13: {
            code = 400;
            title = "Dirección web no válida";
            message = "La dirección web proporcionada no es una URL válida.";
        } break;
        case 14: {
            code = 400;
            title = "Imagen no válida";
            message = "La imagen debe ser un fichero de tipo .png y no superar los 64KB.";
        } break;
        case 15: {
            code = 400;
            title = "Contraseña no válida";
            message = "La contraseña debe tener al menos 8 caracteres, de los cuales al menos 1 debe ser un número y 1 una letra.";
        } break;
        case 16: {
            code = 400;
            title = "Facultad no válida";
            message = "Por favor, asegúrate de seleccionar una facultad de las disponibles.";
        } break;
        case 17: {
            code = 400;
            title = "Usuario ya registrado";
            message = "Este correo ya está registrado en la universidad.";
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

function manageError(error, data, redirect, next) {
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
        data.error = errorObj;
        next({
            ajax: false,
            status: errorObj.code,
            redirect: redirect,
            data: data
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