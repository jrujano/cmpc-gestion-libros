-- Creación de la base de datos
-- (Nota: En PostgreSQL normalmente se crea desde la línea de comandos con: createdb cmpc_libros)
-- \c cmpc_libros

-- Tabla Editorial
CREATE TABLE editorial (
    id_editorial SERIAL PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    direccion VARCHAR(200),
    telefono VARCHAR(20),
    email VARCHAR(100),
    fecha_fundacion DATE,
    website VARCHAR(100)
);

-- Tabla Género
CREATE TABLE genero (
    id_genero SERIAL PRIMARY KEY,
    nombre VARCHAR(50) NOT NULL,
    descripcion TEXT
);

-- Tabla Autor
CREATE TABLE autor (
    id_autor SERIAL PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    biografia TEXT,
    nacionalidad VARCHAR(50),
    fecha_nacimiento DATE,
    fecha_fallecimiento DATE NULL
);

-- Tabla Libro
CREATE TABLE libro (
    id_libro SERIAL PRIMARY KEY,
    titulo VARCHAR(200) NOT NULL,
    ISBN VARCHAR(20) UNIQUE,
    descripcion TEXT,
    precio DECIMAL(10,2) NOT NULL,
    stock INT NOT NULL DEFAULT 0,
    fecha_publicacion DATE,
    id_genero INT,
    id_editorial INT,
    portada VARCHAR(255),
    edicion VARCHAR(20),
    paginas INT,
    FOREIGN KEY (id_genero) REFERENCES genero(id_genero),
    FOREIGN KEY (id_editorial) REFERENCES editorial(id_editorial)
);

-- Tabla de relación Libro-Autor (Muchos a Muchos)
CREATE TABLE libro_autor (
    id_libro INT,
    id_autor INT,
    PRIMARY KEY (id_libro, id_autor),
    FOREIGN KEY (id_libro) REFERENCES libro(id_libro) ON DELETE CASCADE,
    FOREIGN KEY (id_autor) REFERENCES autor(id_autor) ON DELETE CASCADE
);

-- Tabla Cliente
CREATE TABLE cliente (
    id_cliente SERIAL PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    apellido VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE,
    telefono VARCHAR(20),
    direccion TEXT,
    fecha_registro TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabla Venta
CREATE TABLE venta (
    id_venta SERIAL PRIMARY KEY,
    fecha TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    total DECIMAL(12,2) NOT NULL,
    id_cliente INT,
    estado VARCHAR(20) CHECK (estado IN ('pendiente', 'completada', 'cancelada')) DEFAULT 'pendiente',
    FOREIGN KEY (id_cliente) REFERENCES cliente(id_cliente)
);

-- Tabla Detalle Venta
CREATE TABLE detalle_venta (
    id_detalle SERIAL PRIMARY KEY,
    id_venta INT,
    id_libro INT,
    cantidad INT NOT NULL,
    precio_unit DECIMAL(10,2) NOT NULL,
    FOREIGN KEY (id_venta) REFERENCES venta(id_venta) ON DELETE CASCADE,
    FOREIGN KEY (id_libro) REFERENCES libro(id_libro)
);

-- Tabla Inventario (Registro histórico de cambios en stock)
CREATE TABLE inventario (
    id_movimiento SERIAL PRIMARY KEY,
    id_libro INT,
    fecha_movimiento TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    cantidad INT NOT NULL,
    tipo VARCHAR(10) CHECK (tipo IN ('entrada', 'salida', 'ajuste')),
    motivo VARCHAR(200),
    usuario_responsable VARCHAR(100),
    FOREIGN KEY (id_libro) REFERENCES libro(id_libro)
);

-- Tabla Usuario (para el sistema)
CREATE TABLE usuario (
    id_usuario SERIAL PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    nombre VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    rol VARCHAR(20) CHECK (rol IN ('admin', 'inventario', 'ventas')) NOT NULL,
    fecha_registro TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    ultimo_login TIMESTAMP
);

-- Índices para búsquedas frecuentes
CREATE INDEX idx_libro_titulo ON libro(titulo);
CREATE INDEX idx_libro_precio ON libro(precio);
CREATE INDEX idx_libro_stock ON libro(stock);
CREATE INDEX idx_autor_nombre ON autor(nombre);
CREATE INDEX idx_venta_fecha ON venta(fecha);
CREATE INDEX idx_venta_cliente ON venta(id_cliente);

-- Índice de texto completo para búsquedas avanzadas
CREATE INDEX idx_libro_busqueda ON libro USING gin(to_tsvector('spanish', titulo || ' ' || descripcion));

-- Vistas útiles para reportes

-- Vista de inventario actual
CREATE OR REPLACE VIEW vw_inventario_actual AS
SELECT 
    l.id_libro, 
    l.titulo, 
    l.ISBN, 
    l.precio, 
    l.stock,
    g.nombre AS genero,
    e.nombre AS editorial,
    string_agg(a.nombre, ', ') AS autores
FROM 
    libro l
JOIN 
    genero g ON l.id_genero = g.id_genero
JOIN 
    editorial e ON l.id_editorial = e.id_editorial
LEFT JOIN 
    libro_autor la ON l.id_libro = la.id_libro
LEFT JOIN 
    autor a ON la.id_autor = a.id_autor
GROUP BY 
    l.id_libro, g.nombre, e.nombre;

-- Vista de ventas por libro
CREATE OR REPLACE VIEW vw_ventas_por_libro AS
SELECT 
    l.id_libro,
    l.titulo,
    COUNT(dv.id_detalle) AS veces_vendido,
    SUM(dv.cantidad) AS total_unidades,
    SUM(dv.cantidad * dv.precio_unit) AS total_ventas
FROM 
    libro l
LEFT JOIN 
    detalle_venta dv ON l.id_libro = dv.id_libro
GROUP BY 
    l.id_libro;

-- Vista de movimientos de inventario
CREATE OR REPLACE VIEW vw_movimientos_inventario AS
SELECT 
    i.id_movimiento,
    i.fecha_movimiento,
    l.id_libro,
    l.titulo,
    i.cantidad,
    i.tipo,
    i.motivo,
    i.usuario_responsable,
    CASE 
        WHEN i.tipo = 'entrada' THEN l.stock - i.cantidad
        WHEN i.tipo = 'salida' THEN l.stock + i.cantidad
        ELSE l.stock
    END AS stock_anterior,
    l.stock AS stock_actual
FROM 
    inventario i
JOIN 
    libro l ON i.id_libro = l.id_libro;

-- Función para actualizar stock después de una venta
CREATE OR REPLACE FUNCTION actualizar_stock()
RETURNS TRIGGER AS $$
BEGIN
    UPDATE libro 
    SET stock = stock - NEW.cantidad
    WHERE id_libro = NEW.id_libro;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger para actualizar stock
CREATE TRIGGER tr_actualizar_stock
AFTER INSERT ON detalle_venta
FOR EACH ROW
EXECUTE FUNCTION actualizar_stock();

-- Función para registrar movimiento de inventario
CREATE OR REPLACE FUNCTION registrar_movimiento_inventario()
RETURNS TRIGGER AS $$
BEGIN
    IF TG_OP = 'UPDATE' AND NEW.stock <> OLD.stock THEN
        INSERT INTO inventario (id_libro, cantidad, tipo, motivo, usuario_responsable)
        VALUES (
            NEW.id_libro,
            ABS(NEW.stock - OLD.stock),
            CASE WHEN NEW.stock > OLD.stock THEN 'entrada' ELSE 'salida' END,
            'Ajuste automático de inventario',
            current_user
        );
    END IF;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger para registrar cambios en el inventario
CREATE TRIGGER tr_registrar_movimiento_inventario
AFTER UPDATE OF stock ON libro
FOR EACH ROW
WHEN (NEW.stock IS DISTINCT FROM OLD.stock)
EXECUTE FUNCTION registrar_movimiento_inventario();
