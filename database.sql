DROP DATABASE IF EXISTS defcon_store;
CREATE DATABASE defcon_store CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE defcon_store;

CREATE TABLE users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  username VARCHAR(50) NOT NULL UNIQUE,
  password VARCHAR(255) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE products (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  price DECIMAL(10,2) NOT NULL,
  description TEXT,
  image_location VARCHAR(255),
  stock INT DEFAULT 0,
  specifications TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE product_reviews (
  id INT AUTO_INCREMENT PRIMARY KEY,
  product_id INT NOT NULL,
  user_id INT NOT NULL,
  review TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE TABLE cart (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE TABLE cart_items (
  id INT AUTO_INCREMENT PRIMARY KEY,
  cart_id INT NOT NULL,
  product_id INT NOT NULL,
  quantity INT DEFAULT 1,
  FOREIGN KEY (cart_id) REFERENCES cart(id) ON DELETE CASCADE,
  FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE
);

CREATE TABLE sales (
  id INT AUTO_INCREMENT PRIMARY KEY,
  cart_id INT NOT NULL,
  total DECIMAL(10,2) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (cart_id) REFERENCES cart(id) ON DELETE CASCADE
);

INSERT INTO users (username, password) VALUES
('alice', 'password1'),
('bob', 'password2');

INSERT INTO products (name, price, description, image_location, stock, specifications) VALUES
('DEFCON Hoodie', 59.99, 'Black hoodie with DEFCON logo.', '/images/hoodie.jpg', 10, 'Size: L, Color: Black'),
('DEFCON Sticker Pack', 9.99, '5 assorted DEFCON stickers.', '/images/stickers.jpg', 50, 'Material: Vinyl'),
('DEFCON Mug', 15.99, 'Mug with DEFCON skull.', '/images/mug.jpg', 30, 'Capacity: 350ml');

INSERT INTO product_reviews (product_id, user_id, review) VALUES
(1, 1, 'Very comfy hoodie, perfect for DEFCON.'),
(2, 2, 'Cool stickers for my laptop!'),
(3, 1, 'Nice mug, decent quality.');
