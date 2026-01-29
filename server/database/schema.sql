-- Create Database
CREATE DATABASE IF NOT EXISTS product_management;
USE product_management;

-- Categories Table
CREATE TABLE IF NOT EXISTS categories (
    category_id INT PRIMARY KEY AUTO_INCREMENT,
    category_name VARCHAR(100) NOT NULL UNIQUE,
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Products Table
CREATE TABLE IF NOT EXISTS products (
    product_id INT PRIMARY KEY AUTO_INCREMENT,
    product_name VARCHAR(100) NOT NULL,
    category_id INT NOT NULL,
    price DECIMAL(10, 2) DEFAULT 0.00,
    stock_quantity INT DEFAULT 0,
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (category_id) REFERENCES categories(category_id) ON DELETE RESTRICT,
    INDEX idx_category (category_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Insert Sample Categories
INSERT INTO categories (category_name, description) VALUES
('Electronics', 'Electronic devices, gadgets and accessories'),
('Clothing', 'Apparel, fashion and accessories'),
('Books', 'Physical and digital books'),
('Home & Kitchen', 'Home appliances and kitchen essentials'),
('Sports & Fitness', 'Sports equipment and fitness accessories');

-- Insert Sample Products
INSERT INTO products (product_name, category_id, price, stock_quantity, description) VALUES
-- Electronics
('iPhone 15 Pro', 1, 999.99, 50, 'Latest Apple smartphone with A17 Pro chip'),
('Samsung Galaxy S24', 1, 899.99, 45, 'Flagship Android smartphone'),
('MacBook Air M2', 1, 1299.99, 30, '13-inch laptop with M2 chip'),
('Dell XPS 15', 1, 1499.99, 25, 'High-performance Windows laptop'),
('Sony WH-1000XM5', 1, 349.99, 100, 'Premium noise-canceling headphones'),
('iPad Pro 12.9"', 1, 1099.99, 40, 'Professional tablet with M2 chip'),
('Samsung 55" QLED TV', 1, 1199.99, 20, '4K Smart TV with quantum dot technology'),
('Canon EOS R6', 1, 2499.99, 15, 'Professional mirrorless camera'),

-- Clothing
('Nike Air Max 90', 2, 129.99, 150, 'Classic running shoes'),
('Adidas Ultraboost', 2, 179.99, 120, 'Premium running shoes'),
('Levi''s 501 Jeans', 2, 79.99, 200, 'Original straight fit jeans'),
('North Face Jacket', 2, 249.99, 75, 'Waterproof winter jacket'),
('Under Armour T-Shirt', 2, 29.99, 300, 'Performance athletic wear'),

-- Books
('The Great Gatsby', 3, 12.99, 500, 'Classic American novel by F. Scott Fitzgerald'),
('1984', 3, 14.99, 450, 'Dystopian novel by George Orwell'),
('To Kill a Mockingbird', 3, 13.99, 400, 'Harper Lee classic'),
('Harry Potter Set', 3, 89.99, 100, 'Complete 7-book series'),
('Sapiens', 3, 18.99, 250, 'Brief history of humankind'),

-- Home & Kitchen
('KitchenAid Stand Mixer', 4, 379.99, 60, 'Professional 5-quart stand mixer'),
('Ninja Blender', 4, 99.99, 80, 'High-powered blender'),
('Instant Pot Duo', 4, 89.99, 120, '7-in-1 programmable pressure cooker'),
('Dyson V15 Vacuum', 4, 649.99, 35, 'Cordless stick vacuum'),
('Nespresso Machine', 4, 179.99, 70, 'Coffee and espresso maker'),

-- Sports & Fitness
('Peloton Bike', 5, 1445.00, 25, 'Interactive indoor cycling bike'),
('Bowflex Dumbbells', 5, 349.99, 50, 'Adjustable weights 5-52.5 lbs'),
('Yoga Mat Premium', 5, 39.99, 200, 'Non-slip exercise mat'),
('Fitbit Charge 6', 5, 159.99, 150, 'Advanced fitness tracker'),
('Wilson Tennis Racket', 5, 129.99, 75, 'Professional tennis racket');
