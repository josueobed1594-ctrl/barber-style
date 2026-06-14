CREATE DATABASE IF NOT EXISTS barber_style;

USE barber_style;


-- =========================================
-- TABLA USUARIOS (ADMINISTRADORES)
-- =========================================

CREATE TABLE usuarios (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    email VARCHAR(150) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    rol ENUM('admin') DEFAULT 'admin',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);


-- =========================================
-- TABLA CLIENTES
-- =========================================

CREATE TABLE clientes (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(150) NOT NULL,
    telefono VARCHAR(20) NOT NULL,
    email VARCHAR(150),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);


-- =========================================
-- TABLA BARBEROS
-- =========================================

CREATE TABLE barberos (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    telefono VARCHAR(20),
    estado TINYINT(1) DEFAULT 1,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);


-- =========================================
-- TABLA SERVICIOS
-- =========================================

CREATE TABLE servicios (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(150) NOT NULL,
    descripcion TEXT,
    precio DECIMAL(10,2) NOT NULL,
    duracion INT NOT NULL,
    imagen VARCHAR(255),
    estado TINYINT(1) DEFAULT 1,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);


-- =========================================
-- TABLA CITAS
-- =========================================

CREATE TABLE citas (
    id INT AUTO_INCREMENT PRIMARY KEY,

    cliente_id INT NOT NULL,
    barbero_id INT NOT NULL,

    fecha DATE NOT NULL,
    hora TIME NOT NULL,

    estado ENUM(
        'pendiente',
        'confirmada',
        'cancelada',
        'finalizada'
    ) DEFAULT 'pendiente',

    observacion TEXT,

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    FOREIGN KEY (cliente_id)
        REFERENCES clientes(id),

    FOREIGN KEY (barbero_id)
        REFERENCES barberos(id)
);


-- =========================================
-- TABLA CITA_SERVICIOS
-- =========================================

CREATE TABLE cita_servicios (
    id INT AUTO_INCREMENT PRIMARY KEY,

    cita_id INT NOT NULL,
    servicio_id INT NOT NULL,

    FOREIGN KEY (cita_id)
        REFERENCES citas(id)
        ON DELETE CASCADE,

    FOREIGN KEY (servicio_id)
        REFERENCES servicios(id)
);