
"use strict"

// --- Importar módulos ---
// Core
const path = require("path");

// Paquete
const express = require("express");
const mySQL = require("mysql");
const session = require("express-session");
const mySQLsession = require("express-mysql-session");
const morgan = require("morgan");
const multer = require("multer");
const { check, validationResult } = require("express-validator");

// Fichero
const mySQLconfig = require("./config");
const DAOFacilities = require("./dao/DAOFacilities");
const DAOMessages = require("./dao/DAOMessages");
const DAOReservations = require("./dao/DAOReservations");
const DAOUniversities = require("./dao/DAOUniversities");
const DAOUsers = require("./dao/DAOUsers");
const FacilityController = require("./controller/FacilityController");
const MessageController = require("./controller/MessageController");
const ReservationController = require("./controller/ReservationController");
const UniversityController = require("./controller/UniversityController");
const UserController = require("./controller/UserController");
const routerAdmin = require("./routes/RouterAdmin");
const routerPersonal = require("./routes/RouterPersonal");
const routerUser = require("./routes/RouterUser");

// --- Crear aplicación Express ---
const app = express();

// --- EJS ---
app.set("view engine", "ejs"); // Configurar EJS como motor de plantillas
app.set("views", path.join(__dirname, "views")); // Definir el directorio de plantillas

// --- Multer ---
const multerFactory = multer({ storage: multer.memoryStorage() });

// --- BodyParser (Express) ---
app.use(express.urlencoded({extended: true}));

// --- Static ---
app.use(express.static(path.join(__dirname, "public"))); // Gestionar ficheros estáticos con static

// --- Morgan ---
app.use(morgan("dev")); // Imprimir peticiones recibidas

// --- Sesiones y MySQL ---
// Sesión MySQL
const mySQLStore = mySQLsession(session);
const sessionStore = new mySQLStore(mySQLconfig.config);

// Crear middleware de la sesión
const middlewareSession = session({
    saveUninitialized: false,
    secret: "riuUCM18",
    resave: true,
    store: sessionStore
});
app.use(middlewareSession);

// Crear pool de conexiones
const pool = mySQL.createPool(mySQLconfig.config);

// --- DAOs y Controllers ---
// Crear instancias de los DAOs
const daoFac = new DAOFacilities(pool);
const daoMes = new DAOMessages(pool);
const daoRes = new DAOReservations(pool);
const daoUni = new DAOUniversities(pool);
const daoUse = new DAOUsers(pool);
// Crear instancias de los Controllers
const facController = new FacilityController(daoFac);
const mesController = new MessageController(daoMes, daoUni, daoUse);
const resController = new ReservationController(daoRes, daoUni, daoFac, daoMes);
const uniController = new UniversityController(daoUni);
const useController = new UserController(daoUse, daoUni, daoFac, daoMes);

// --- VARIABLES GLOBALES ---
const mailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const passwordRegex = /(?=.*[A-Za-z])(?=.*\d).{8,}/;

app.locals.universityMails = ["ucm.es", "uam.es"];

// --- Middlewares ---
// Comprobar que el usuario ha iniciado sesión
function userLogged(request, response, next) {
    if (request.session.currentUser) {
        next();
    }
    else {
        response.redirect("/login");
    }
};

// Comprobar que el usuario no había iniciado sesión
function userAlreadyLogged(request, response, next) {
    if (request.session.currentUser) {
        response.redirect("/inicio");
    }
    else {
        next();
    }
};

// --- Peticiones GET ---

// - Rutas -
// SignUp
app.get("/registro", userAlreadyLogged, (request, response, next) => {
    response.render("sign_up", { response: undefined });
});

// Login
app.get("/login", userAlreadyLogged, (request, response, next) => {
    response.render("login", { mail:"", response: undefined });
});

// Inicio
app.get(["/", "/inicio"], userLogged, useController.userBanned, (request, response, next) => {
    if (request.session.currentUser.rol) { // Admin
        response.redirect("/admin/inicio");
    }
    else { // User
        response.redirect("/usuario/inicio");
    }
});

// Reservas
app.get("/reservas", userLogged, useController.userBanned, (request, response, next) => {
    if (request.session.currentUser.rol) { // Admin
        response.redirect("/admin/reservas");
    }
    else { // User
        response.redirect("/usuario/reservas");
    }
});

// - Routers -
routerAdmin.routerConfig(facController, mesController, resController, uniController, useController);
routerUser.routerConfig(facController, mesController, resController, uniController, useController);
routerPersonal.routerConfig(facController, mesController, resController, uniController, useController);

app.use("/admin", userLogged, useController.userBanned, useController.isAdmin, routerAdmin.RouterAdmin);
app.use("/personal", userLogged, useController.userBanned, routerPersonal.RouterPersonal);
app.use("/usuario", userLogged, useController.userBanned, routerUser.RouterUser);

// - Otras peticiones GET -
// Imagen del usuario
app.get(
    "/fotoPerfil/:id", 
    userLogged,
    check("id", "-2").isNumeric(),
    useController.userBanned, 
    useController.accessPicAllowed,
    useController.profilePic
);

// Logo de la universidad
app.get(
    "/fotoUniversidad/:id", 
    userLogged,
    check("id", "-2").isNumeric(),
    useController.userBanned, 
    uniController.universityPic
);

// Foto del tipo de instalación
app.get(
    "/fotoTipoInstalacion/:id", 
    userLogged,
    check("id", "-2").isNumeric(),
    useController.userBanned, 
    facController.facilityTypePic    
);

// Foto de la instalación
app.get("/fotoInstalacion/:id",
    userLogged,
    check("id", "-2").isNumeric(),
    useController.userBanned,
    facController.facilityPic
);

// Correos de las universidades registradas
app.get("/correosDisponibles", uniController.universityMails);

// Facultades que tiene una universidad
app.get("/facultades", uniController.faculties);

// --- Peticiones POST ---

// Login
app.post(
    "/login",
    // Ninguno de los campos vacíos 
    check("mail", "1").notEmpty(),
    check("password", "1").notEmpty(),
    // Correo es uno de los disponibles
    check("mail", "2")
        .custom((mail) => {
            if (mailRegex.test(mail)) {
                let mailAfterAt = mail.split("@")[1];
                return app.locals.universityMails.includes(mailAfterAt);
            }
            else {
                return false;
            }
        }),
    useController.login
);

// Logout
app.post("/logout", useController.logout);

// Registro
app.post(
    "/registro",
    // Ninguno de los campos vacíos
    check("name", "1").notEmpty(),
    check("lastname1", "1").notEmpty(),
    check("lastname2", "1").notEmpty(),
    check("mail", "1").notEmpty(),
    check("password", "1").notEmpty(),
    check("faculty", "1").notEmpty(),
    // Correo es uno de los disponibles
    check("mail", "2")
        .custom((mail) => {
            if (mailRegex.test(mail)) {
                let mailAfterAt = mail.split("@")[1];
                return app.locals.universityMails.includes(mailAfterAt);
            }
            else {
                return false;
            }
        }),
    // Contraseña válida
    check("password", "15").custom((pass) => {
        return passwordRegex.test(pass);
    }),
    useController.signUp
);

// --- Middlewares de respuestas y errores ---
// Error 404
app.use((request, response, next) => {
    next({
        ajax: false,
        status: 404,
        redirect: "error",
        data: {
            code: 404,
            title: "Oops! Página no encontrada :(",
            message: "La página a la que intentas acceder no existe."
        }
    }); 
});

// Manejador de respuestas 
app.use((responseData, request, response, next) => {
    // Respuestas AJAX
    if (responseData.ajax) {
        if (responseData.error) {
            response.status(responseData.status).send(responseData.error);
            response.end();
        }
        else if (responseData.img) {
            response.end(responseData.img);
        }
        else {
            response.json(responseData.data);
        }
    }
    // Respuestas no AJAX
    else {
        response.status(responseData.status);
        response.render(responseData.redirect, responseData.data);
    }
});

// --- Iniciar el servidor ---
app.listen(mySQLconfig.port, (error) => {
    if (error) {
        console.error(`Se ha producido un error al iniciar el servidor: ${error.message}`);
    }
    else {
        console.log(`Se ha arrancado el servidor en el puerto ${mySQLconfig.port}`);
    }
});