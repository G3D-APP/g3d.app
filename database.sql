-- BASE DE DATOS PARA G3D ADMIN SYSTEM
-- Ejecuta este script en tu servidor MySQL/MariaDB o PostgreSQL

CREATE TABLE users (
    id VARCHAR(50) PRIMARY KEY,
    username VARCHAR(50) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    full_name VARCHAR(100) NOT NULL,
    role ENUM('ADMIN', 'SELLER', 'COLLABORATOR') NOT NULL DEFAULT 'SELLER',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    -- Permisos almacenados como JSON o booleanos individuales
    permissions JSON
);

CREATE TABLE orders (
    id VARCHAR(50) PRIMARY KEY,
    order_number INT AUTO_INCREMENT UNIQUE,
    customer_name VARCHAR(100) NOT NULL,
    seller_id VARCHAR(50),
    job_type VARCHAR(50),
    details TEXT,
    status ENUM('PRESUPUESTO', 'FALTA_DISENAR', 'DISENADO', 'EN_PRODUCCION', 'PENDIENTE_ENTREGA', 'ENTREGADO') DEFAULT 'PRESUPUESTO',
    priority INT DEFAULT 0, -- 0 Normal, 1 Alta
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    deadline DATETIME,
    
    -- Datos Financieros
    total_price DECIMAL(10, 2) DEFAULT 0.00,
    deposit_amount DECIMAL(10, 2) DEFAULT 0.00,
    is_paid BOOLEAN DEFAULT FALSE,

    FOREIGN KEY (seller_id) REFERENCES users(id) ON DELETE SET NULL
);

CREATE TABLE inventory_items (
    id VARCHAR(50) PRIMARY KEY,
    sku VARCHAR(50) UNIQUE,
    name VARCHAR(100) NOT NULL,
    category VARCHAR(50), -- 'FILAMENT', 'PRINTED', 'EXTRA', 'SIGNAGE'
    stock_quantity DECIMAL(10, 2) DEFAULT 0,
    unit VARCHAR(20), -- kg, unidad, m2
    cost_price DECIMAL(10, 2), -- Precio de compra/costo
    sale_price DECIMAL(10, 2), -- Precio de venta al público
    min_stock_alert DECIMAL(10, 2) DEFAULT 5,
    
    -- Atributos específicos
    filament_type VARCHAR(50), -- PLA, PETG (Solo para filamentos)
    weight_grams DECIMAL(10, 2), -- Solo para impresos
    print_time VARCHAR(20), -- Solo para impresos
    stl_file_url VARCHAR(255) -- Solo para impresos
);

CREATE TABLE order_items (
    id INT AUTO_INCREMENT PRIMARY KEY,
    order_id VARCHAR(50),
    inventory_item_id VARCHAR(50),
    item_name VARCHAR(100), -- Guardamos nombre por si se borra del inventario
    quantity DECIMAL(10, 2) NOT NULL,
    unit_price DECIMAL(10, 2) NOT NULL,
    
    FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE,
    FOREIGN KEY (inventory_item_id) REFERENCES inventory_items(id) ON DELETE SET NULL
);

CREATE TABLE app_config (
    id INT PRIMARY KEY DEFAULT 1,
    company_name VARCHAR(100) DEFAULT 'G3D APP',
    logo_url TEXT,
    filament_cost_per_kg DECIMAL(10, 2) DEFAULT 15000.00,
    electricity_rate_per_hour DECIMAL(10, 2) DEFAULT 50.00,
    extra_expenses_base DECIMAL(10, 2) DEFAULT 200.00,
    profit_margin_percentage DECIMAL(5, 2) DEFAULT 30.00,
    job_types JSON -- Array de strings: ["Cartelería", "Llaveros", etc]
);

-- DATOS DE EJEMPLO (SEED)

INSERT INTO users (id, username, password_hash, full_name, role, permissions) VALUES 
('1', 'admin', 'admin', 'Administrador Principal', 'ADMIN', '{"canCreateOrders": true, "viewAllOrders": true, "editCostParams": true}'),
('2', 'vendedor', '123', 'Juan Vendedor', 'SELLER', '{"canCreateOrders": true, "viewAllOrders": false, "editCostParams": false}');

INSERT INTO app_config (id) VALUES (1);
