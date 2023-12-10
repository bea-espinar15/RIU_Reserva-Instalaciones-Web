-- Crear tablas

-- UNIVERSIDAD
CREATE TABLE RIU_UNI_Universidad (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(255) NOT NULL,
    web VARCHAR(255) NOT NULL,
    dirección VARCHAR(255) NOT NULL,
    correo VARCHAR(255) NOT NULL,
    logo BLOB,

    CONSTRAINT UC_Universidad UNIQUE (nombre)
);

-- FACULTAD
CREATE TABLE RIU_FAC_Facultad (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(255) NOT NULL,
    id_universidad INT NOT NULL,

    CONSTRAINT UC_Facultad UNIQUE(nombre, id_universidad),
    FOREIGN KEY (id_universidad) REFERENCES RIU_UNI_Universidad(id)
);

-- USUARIOS
CREATE TABLE RIU_USU_Usuario (
    id INT AUTO_INCREMENT PRIMARY KEY,
    activo INT NOT NULL DEFAULT 1,
    validado INT NOT NULL DEFAULT 0,
    nombre VARCHAR(255) NOT NULL,
    apellido1 VARCHAR(255) NOT NULL,
    apellido2 VARCHAR(255) NOT NULL,
    correo VARCHAR(255) NOT NULL,
    contraseña VARCHAR(255) NOT NULL,
    foto BLOB,
    rol INT NOT NULL DEFAULT 0,    
    id_facultad INT NOT NULL,

    FOREIGN KEY (id_facultad) REFERENCES RIU_FAC_Facultad(id)
);

-- TIPO INSTALACIÓN
CREATE TABLE RIU_TIN_Tipo_Instalación (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(255) NOT NULL,
    foto BLOB,
    id_universidad INT NOT NULL,

    CONSTRAINT UC_Tipo_Instalación UNIQUE(nombre, id_universidad),
    FOREIGN KEY (id_universidad) REFERENCES RIU_UNI_Universidad(id)
);

-- INSTALACIÓN
CREATE TABLE RIU_INS_Instalación (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(255) NOT NULL,
    hora_ini TIME NOT NULL,
    hora_fin TIME NOT NULL,
    completo INT NOT NULL,
    tipo_reserva INT NOT NULL,
    aforo INT NOT NULL,
    foto BLOB,
    id_tipo INT NOT NULL,

    CONSTRAINT UC_Instalación UNIQUE(nombre, id_tipo),
    FOREIGN KEY (id_tipo) REFERENCES RIU_TIN_Tipo_Instalación(id)
);

-- RESERVA
CREATE TABLE RIU_RES_Reserva (
    id INT AUTO_INCREMENT PRIMARY KEY,
    activo INT NOT NULL DEFAULT 1,
    id_usuario INT NOT NULL,
    id_instalación INT NOT NULL,
    n_personas INT NOT NULL,
    fecha DATE NOT NULL,
    hora TIME NOT NULL,
    cola INT NOT NULL,
    fecha_reserva TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT UC_Reserva UNIQUE(id_usuario, id_instalación, fecha, hora),
    FOREIGN KEY (id_usuario) REFERENCES RIU_USU_Usuario(id),
    FOREIGN KEY (id_instalación) REFERENCES RIU_INS_Instalación(id)
);

-- CORREO
CREATE TABLE RIU_MEN_Mensaje (
    id INT AUTO_INCREMENT PRIMARY KEY,
    id_usuario_origen INT NOT NULL,
    id_usuario_destino INT NOT NULL,
    mensaje VARCHAR(255) NOT NULL,
    asunto VARCHAR(255),
    fecha_envío TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    fecha_leído TIMESTAMP NULL,

    FOREIGN KEY (id_usuario_origen) REFERENCES RIU_USU_Usuario(id),
    FOREIGN KEY (id_usuario_destino) REFERENCES RIU_USU_Usuario(id)
);

-- Insertar datos de prueba

-- UNIVERSIDAD
INSERT INTO RIU_UNI_Universidad (nombre, web, dirección, correo) VALUES
('Universidad Complutense de Madrid', 'https://www.ucm.es/', 'Av. Complutense, s/n, 28040 Madrid', 'ucm.es'),
('Universidad Autonoma de Madrid', 'https://www.uam.es/uam/inicio', 'Ciudad Universitaria de Cantoblanco, 28049 Madrid', 'uam.es');


-- FACULTAD
INSERT INTO RIU_FAC_Facultad (nombre, id_universidad) VALUES
('Facultad de Informática', 1),
('Facultad de Derecho', 1),
('Facultad de Medicina', 1),
('Facultad de Bellas Artes', 1),

('Facultad de Ciencias', 2),
('Facultad de Filosofía y Letras', 2),
('Facultad de Psicología', 2);


-- USUARIOS
INSERT INTO RIU_USU_Usuario (validado, nombre, apellido1, apellido2, correo, contraseña, rol, id_facultad) VALUES
(1, 'Beatriz', 'Espinar', 'Aragón', 'beaesp01', '1234', 0, 1),
(1, 'Lucas', 'Bravo', 'Fairen', 'lucbravo', '1234', 0, 1),
(1, 'Jesús', 'Cáceres', 'Tello', 'jescacer', '1234', 1, 1),

(1, 'Julia', 'Chacón', 'Labella', 'julia.chacon', '1234', 1, 5);


-- TIPO INSTALACIÓN
INSERT INTO RIU_TIN_Tipo_Instalación (nombre, id_universidad) VALUES
('Laboratorio', 1),
('Salas de grados', 1),
('Salón de actos', 1),
('Salas de reunión', 1),
('Sala de estudio', 1),

('Laboratorio', 2),
('Salas de grados', 2),
('Salón de actos', 2);


-- INSTALACIÓN
INSERT INTO RIU_INS_Instalación (nombre, hora_ini, hora_fin, completo, tipo_reserva, aforo, id_tipo) VALUES
('Laboratorio 1 - Informática', '09:00', '18:00', 0, 1, 60, 1),
('Laboratorio 2 - Informática', '09:00', '18:00', 0, 1, 60, 1),
('Laboratorio 3 - Informática', '09:00', '18:00', 0, 1, 30, 1),
('Laboratorio 4 - Informática', '09:00', '18:00', 0, 1, 30, 1),

('Salas de grados 1 - Informática', '09:00', '18:00', 0, 1, 120, 2),
('Salas de grados 2 - Informática', '09:00', '18:00', 0, 1, 120, 2),
('Salas de grados 3 - Informática', '09:00', '18:00', 0, 1, 90, 2),
('Salas de grados 1 - Derecho', '09:00', '18:00', 0, 1, 90, 2),
('Salas de grados 2 - Derecho', '09:00', '18:00', 0, 1, 80, 2),
('Salas de grados 3 - Derecho', '09:00', '18:00', 0, 1, 80, 2),

('Salón de actos 1 - Informática', '09:00', '18:00', 1, 1, 250, 3),
('Salón de actos 1 - Medicina', '09:00', '18:00', 1, 1, 250, 3),

('Salas de reunión 1 - Informática', '09:00', '18:00', 0, 1, 10, 4),
('Salas de reunión 2 - Informática', '09:00', '18:00', 0, 1, 10, 4),
('Salas de reunión 1 - Derecho', '09:00', '18:00', 0, 1, 8, 4),
('Salas de reunión 1 - Medicina', '09:00', '18:00', 0, 1, 5, 4),
('Salas de reunión 1 - Bellas Artes', '09:00', '18:00', 0, 1, 5, 4),

('Sala de estudio 1 - Informática', '09:00', '18:00', 0, 0, 1, 5),
('Sala de estudio 2 - Informática', '09:00', '18:00', 0, 0, 1, 5),
('Sala de estudio 1 - Medicina', '09:00', '18:00', 0, 0, 1, 5),
('Sala de estudio 1 - Bellas Artes', '09:00', '18:00', 0, 0, 1, 5),
('Sala de estudio 2 - Bellas Artes', '09:00', '18:00', 0, 0, 1, 5);


-- RESERVA
INSERT INTO RIU_RES_Reserva (activo, id_usuario, id_instalación, n_personas, fecha, hora, cola, fecha_reserva) VALUES
(1, 1, 18, 1, '2023-12-15', '09:00:00', 0, '2023-11-26 18:06:23'),
(1, 1, 1, 15, '2023-12-20', '09:00:00', 0, '2023-11-26 18:06:24'),
(1, 1, 5, 87, '2023-12-13', '09:00:00', 0, '2023-11-26 18:06:25'),

(1, 2, 18, 1, '2023-12-15', '09:00:00', 1, '2023-11-26 18:06:26'),
(1, 2, 11, 220, '2023-12-15', '09:00:00', 0, '2023-11-26 18:06:27'),
(1, 2, 5, 1, '2023-12-14', '09:00:00', 0, '2023-11-26 18:06:28');


-- CORREO
INSERT INTO RIU_MEN_Mensaje (id_usuario_origen, id_usuario_destino, mensaje, asunto, fecha_envío, fecha_leído) VALUES
(1, 2, 'Hola Beatriz', 'Segundo mensaje', '2023-11-25 18:06:23', '2023-11-26 18:06:23'),
(1, 3, 'Hola Jesús', 'Primer mensaje', '2023-11-25 10:10:10', '2023-11-26 10:10:10'),

(2, 1, 'Adiós Lucas', 'Primera respuesta', '2023-11-26 23:18:06', '2023-11-27 23:18:06'),
(2, 3, 'Hola Jesús', 'Primer mensaje', '2023-11-26 10:10:10', '2023-11-26 10:11:11'),

(3, 1, 'Adiós Lucas', 'Primera respuesta', '2023-11-26 10:10:30', '2023-11-27 10:10:10'),
(3, 2, 'Adiós Beatriz', 'Segunda respuesta', '2023-11-26 10:11:31', '2023-11-27 10:10:10'),
(3, 1, 'Hola a todos', 'Primer mensaje', '2023-11-28 09:00:00', null),
(3, 2, 'Hola a todos', 'Segundo mensaje', '2023-11-28 09:00:00', null);