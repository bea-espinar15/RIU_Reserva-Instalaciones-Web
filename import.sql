-- Crear tablas

-- UNIVERSIDAD
CREATE TABLE universidad (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(255) NOT NULL,
    web VARCHAR(255) NOT NULL,
    direccion VARCHAR(255) NOT NULL,
    correo VARCHAR(255) NOT NULL,
    logo BLOB
);

-- FACULTAD
CREATE TABLE facultad (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(255) NOT NULL,
    id_universidad INT NOT NULL,

    CONSTRAINT UC_Facultad UNIQUE(nombre, id_universidad),
    FOREIGN KEY (id_universidad) REFERENCES universidad(id)
);

-- USUARIOS
CREATE TABLE usuario (
    id INT AUTO_INCREMENT PRIMARY KEY,
    activo INT NOT NULL,
    nombre VARCHAR(255) NOT NULL,
    apellido1 VARCHAR(255) NOT NULL,
    apellido2 VARCHAR(255) NOT NULL,
    correo VARCHAR(255) NOT NULL,
    password VARCHAR(255) NOT NULL,
    curso INT NOT NULL,
    grupo CHAR NOT NULL,
    rol INT NOT NULL,
    foto BLOB,
    id_facultad INT NOT NULL,

    CONSTRAINT UC_Usuario UNIQUE(correo, nombre, apellido1, apellido2),
    FOREIGN KEY (id_facultad) REFERENCES facultad(id)
);

-- TIPO INSTALACIÓN
CREATE TABLE tipo_instalacion (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(255) NOT NULL,
    foto BLOB,
    id_universidad INT NOT NULL,

    CONSTRAINT UC_Tipo_Instalacion UNIQUE(nombre, id_universidad),
    FOREIGN KEY (id_universidad) REFERENCES universidad(id)
);

-- INSTALACIÓN
CREATE TABLE instalacion (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(255) NOT NULL,
    hora_ini TIME NOT NULL,
    hora_fin TIME NOT NULL,
    completo INT NOT NULL,
    tipo_reserva INT NOT NULL,
    aforo INT NOT NULL,
    id_tipo INT NOT NULL,

    CONSTRAINT UC_Instalacion UNIQUE(nombre, id_tipo),
    FOREIGN KEY (id_tipo) REFERENCES tipo_instalacion(id)
);

-- RESERVA
CREATE TABLE reserva (
    id INT AUTO_INCREMENT PRIMARY KEY,
    activo INT NOT NULL,
    id_usuario INT NOT NULL,
    id_instalacion INT NOT NULL,
    n_personas INT NOT NULL,
    fecha DATE NOT NULL,
    hora TIME NOT NULL,
    cola INT NOT NULL,
    fecha_reserva TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT UC_Reserva UNIQUE(fecha, hora, id_usuario, id_instalacion),
    FOREIGN KEY (id_usuario) REFERENCES usuario(id),
    FOREIGN KEY (id_instalacion) REFERENCES instalacion(id)
);

-- CORREO
CREATE TABLE correo (
    id INT AUTO_INCREMENT PRIMARY KEY,
    id_usuario_origen INT NOT NULL,
    id_usuario_destino INT NOT NULL,
    mensaje VARCHAR(255) NOT NULL,
    asunto VARCHAR(255) NOT NULL,
    fecha_envio DATETIME,
    fecha_leido DATETIME,

    FOREIGN KEY (id_usuario_origen) REFERENCES usuario(id),
    FOREIGN KEY (id_usuario_destino) REFERENCES usuario(id)
);

-- Insertar datos de prueba

-- UNIVERSIDAD
INSERT INTO universidad (nombre, web, direccion, correo) VALUES
('Universidad Complutense de Madrid', 'https://www.ucm.es/', 'Av. Complutense, s/n, 28040 Madrid', '@ucm.es'),
('Universidad Autonoma de Madrid', 'https://www.uam.es/uam/inicio', 'Ciudad Universitaria de Cantoblanco, 28049 Madrid', '@uam.es'),
('Universidad Carlos III de Madrid', 'https://www.uc3m.es/Inicio', 'Av. de Gregorio Peces-Barba Martínez, 22, 28270 Colmenarejo, Madrid', '@alumnos.uc3m.es'),
('Universidad Rey Juan Carlos', 'https://www.urjc.es/', 'Av. del Alcalde de Móstoles, 28933 Móstoles, Madrid', '@urjc.es');


-- FACULTAD
INSERT INTO facultad (nombre, id_universidad) VALUES
('Facultad de Informática', 1),
('Facultad de Derecho', 1),
('Facultad de Medicina', 1),
('Facultad de Bellas Artes', 1),

('Facultad de Ciencias', 2),
('Facultad de Filosofía y Letras', 2),
('Facultad de Psicología', 2),

('Facultad de Ciencias Sociales y Jurídicas', 3),
('Facultad de Humanidades, Comunicación y Documentación', 3),

('Facultad de Ciencias de la Comunicación', 4),
('Facultad de Ciencias de la Salud', 4);


-- USUARIOS
INSERT INTO usuario (activo, nombre, apellido1, apellido2, correo, password, curso, grupo, rol, id_facultad) VALUES
(1, 'Beatriz', 'Espinar', 'Aragón', 'beaesp01@ucm.es', '1234', 4, 'E', 0, 1),
(1, 'Lucas', 'Bravo', 'Fairen', 'lucbravo@ucm.es', '1234', 4, 'E', 0, 1),
(1, 'Jesús', 'Cáceres', 'Tello', 'jescacer@ucm.es', '1234', 4, 'E', 1, 1);


-- TIPO INSTALACIÓN
INSERT INTO tipo_instalacion (nombre, id_universidad) VALUES
('Laboratorio', 1),
('Salas de grados', 1),
('Salón de actos', 1),
('Salas de reunión', 1),
('Sala de estudio', 1),

('Laboratorio', 2),
('Salas de grados', 2),
('Salón de actos', 2),

('Laboratorio', 3),
('Salas de grados', 3),

('Laboratorio', 4),
('Salas de grados', 4);


-- INSTALACIÓN
INSERT INTO instalacion (nombre, hora_ini, hora_fin, completo, tipo_reserva, aforo, id_tipo) VALUES
('Laboratorio 1', '09:00', '18:00', 0, 1, 60, 1),
('Laboratorio 2', '09:00', '18:00', 0, 1, 60, 1),
('Laboratorio 3', '09:00', '18:00', 0, 1, 30, 1),
('Laboratorio 4', '09:00', '18:00', 0, 1, 30, 1),

('Salas de grados 1', '09:00', '18:00', 0, 1, 120, 2),
('Salas de grados 2', '09:00', '18:00', 0, 1, 120, 2),
('Salas de grados 3', '09:00', '18:00', 0, 1, 90, 2),
('Salas de grados 4', '09:00', '18:00', 0, 1, 90, 2),
('Salas de grados 5', '09:00', '18:00', 0, 1, 80, 2),
('Salas de grados 6', '09:00', '18:00', 0, 1, 80, 2),

('Salón de actos 1', '09:00', '18:00', 1, 1, 250, 3),
('Salón de actos 2', '09:00', '18:00', 1, 1, 250, 3),

('Salas de reunión 1', '09:00', '18:00', 0, 1, 10, 4),
('Salas de reunión 2', '09:00', '18:00', 0, 1, 10, 4),
('Salas de reunión 3', '09:00', '18:00', 0, 1, 8, 4),
('Salas de reunión 4', '09:00', '18:00', 0, 1, 5, 4),
('Salas de reunión 5', '09:00', '18:00', 0, 1, 5, 4),

('Sala de estudio 1', '09:00', '18:00', 0, 0, 1, 5),
('Sala de estudio 2', '09:00', '18:00', 0, 0, 1, 5),
('Sala de estudio 3', '09:00', '18:00', 0, 0, 1, 5),
('Sala de estudio 4', '09:00', '18:00', 0, 0, 1, 5),
('Sala de estudio 5', '09:00', '18:00', 0, 0, 1, 5);


-- RESERVA
INSERT INTO reserva (activo, id_usuario, id_instalacion, n_personas, fecha, hora, cola, fecha_reserva) VALUES
(1, 1, 18, 1, '2023-12-15', '09:00:00', 0, '2023-11-26 18:06:23'),
(1, 1, 1, 15, '2023-12-20', '09:00:00', 0, '2023-11-26 18:06:24'),
(1, 1, 5, 87, '2023-12-13', '09:00:00', 0, '2023-11-26 18:06:25'),

(1, 2, 18, 1, '2023-12-15', '09:00:00', 1, '2023-11-26 18:06:26'),
(1, 1, 11, 220, '2023-12-15', '09:00:00', 0, '2023-11-26 18:06:27'),
(1, 1, 5, 1, '2023-12-14', '09:00:00', 0, '2023-11-26 18:06:28');


-- CORREO
INSERT INTO correo (id_usuario_origen, id_usuario_destino, mensaje, asunto, fecha_envio, fecha_leido) VALUES
(1, 2, 'Hola Beatriz', 'Primer mensaje', '2023-11-25 18:06:23', '2023-11-26 18:06:23'),
(1, 3, 'Hola Jesús', 'Segundo mensaje', '2023-11-25 10:10:10', '2023-11-26 10:10:10'),

(2, 1, 'Adiós Lucas', 'Respuesta mensaje', '2023-11-26 23:18:06', '2023-11-27 23:18:06'),
(2, 3, 'Hola Jesús', 'Primer mensaje', '2023-11-26 10:10:10', '2023-11-26 10:11:11'),

(3, 1, 'Adiós Lucas', 'Primera respuesta', '2023-11-26 10:10:30', '2023-11-27 10:10:10'),
(3, 2, 'Adiós Beatriz', 'Segunda respuesta', '2023-11-26 10:11:31', '2023-11-26 23:06:18'),
(3, 1, 'Hola a todos', 'Primer mensaje', '2023-11-28 09:00:00', null),
(3, 2, 'Hola a todos', 'Segundo mensaje', '2023-11-28 09:00:00', null);