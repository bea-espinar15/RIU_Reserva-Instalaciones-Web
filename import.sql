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
    foto BLOB,
    id_facultad INT NOT NULL,

    FOREIGN KEY (id_facultad) REFERENCES facultad(id)
);

-- TIPO INSTALACIÓN
CREATE TABLE tipo_instalacion (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(255) NOT NULL,
    foto BLOB,
    id_universidad INT NOT NULL,

    FOREIGN KEY (id_universidad) REFERENCES universidad(id)
);

-- INSTALACIÓN
CREATE TABLE instalacion (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(255) NOT NULL,
    hora_ini DATE NOT NULL,
    hora_fin DATE NOT NULL,
    completo INT NOT NULL,
    tipo_reserva INT NOT NULL,
    aforo INT NOT NULL,
    id_tipo INT NOT NULL,

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
    hora TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    cola INT NOT NULL,
    fecha_reserva DATETIME,

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


-- FACULTAD


-- USUARIOS


-- TIPO INSTALACIÓN


-- INSTALACIÓN


-- RESERVA


-- CORREO
