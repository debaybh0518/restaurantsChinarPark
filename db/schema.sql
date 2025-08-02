-- PostgreSQL schema for Restaurant Management System
CREATE TABLE companies (
    company_id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    contact VARCHAR(255),
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE branches (
    branch_id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    company_id INTEGER REFERENCES companies(company_id),
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE roles (
    role_id SERIAL PRIMARY KEY,
    name VARCHAR(50) NOT NULL UNIQUE
);

CREATE TABLE users (
    user_id SERIAL PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    role_id INTEGER REFERENCES roles(role_id),
    company_id INTEGER REFERENCES companies(company_id),
    branch_id INTEGER REFERENCES branches(branch_id),
    name VARCHAR(255),
    phone VARCHAR(20),
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE menus (
    menu_id SERIAL PRIMARY KEY,
    branch_id INTEGER REFERENCES branches(branch_id),
    name VARCHAR(255) NOT NULL,
    category VARCHAR(255),
    available BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE menu_items (
    item_id SERIAL PRIMARY KEY,
    menu_id INTEGER REFERENCES menus(menu_id),
    name VARCHAR(255) NOT NULL,
    price NUMERIC(10,2) NOT NULL,
    description TEXT,
    available BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE orders (
    order_id SERIAL PRIMARY KEY,
    branch_id INTEGER REFERENCES branches(branch_id),
    user_id INTEGER REFERENCES users(user_id),
    table_id INTEGER,
    status VARCHAR(50),
    type VARCHAR(50),
    total NUMERIC(10,2),
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE order_items (
    order_item_id SERIAL PRIMARY KEY,
    order_id INTEGER REFERENCES orders(order_id),
    item_id INTEGER REFERENCES menu_items(item_id),
    quantity INTEGER NOT NULL,
    price NUMERIC(10,2) NOT NULL
);

CREATE TABLE kots (
    kot_id SERIAL PRIMARY KEY,
    order_id INTEGER REFERENCES orders(order_id),
    status VARCHAR(50),
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE inventory (
    inventory_id SERIAL PRIMARY KEY,
    branch_id INTEGER REFERENCES branches(branch_id),
    name VARCHAR(255) NOT NULL,
    quantity NUMERIC(10,2) NOT NULL,
    unit VARCHAR(50),
    low_stock_threshold NUMERIC(10,2),
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE inventory_logs (
    log_id SERIAL PRIMARY KEY,
    inventory_id INTEGER REFERENCES inventory(inventory_id),
    change NUMERIC(10,2),
    reason VARCHAR(255),
    created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE tables (
    table_id SERIAL PRIMARY KEY,
    branch_id INTEGER REFERENCES branches(branch_id),
    name VARCHAR(50),
    status VARCHAR(50),
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE payments (
    payment_id SERIAL PRIMARY KEY,
    order_id INTEGER REFERENCES orders(order_id),
    status VARCHAR(50),
    method VARCHAR(50),
    billdesk_txn_id VARCHAR(255),
    amount NUMERIC(10,2),
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE notifications (
    notification_id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(user_id),
    type VARCHAR(50),
    message TEXT,
    status VARCHAR(50),
    sent_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE reservations (
    reservation_id SERIAL PRIMARY KEY,
    branch_id INTEGER REFERENCES branches(branch_id),
    table_id INTEGER REFERENCES tables(table_id),
    customer_name VARCHAR(255),
    customer_phone VARCHAR(20),
    status VARCHAR(50),
    reserved_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE audit_logs (
    log_id SERIAL PRIMARY KEY,
    actor_id INTEGER REFERENCES users(user_id),
    action VARCHAR(255),
    entity VARCHAR(255),
    entity_id INTEGER,
    created_at TIMESTAMP DEFAULT NOW()
);

-- Seed roles
INSERT INTO roles (name) VALUES ('super_admin'), ('branch_admin'), ('waiter'), ('chef'), ('cashier');
