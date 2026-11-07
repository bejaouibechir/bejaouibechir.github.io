USE shop;

CREATE TABLE products (
    sku VARCHAR(32) PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    unit_price DECIMAL(10,2) NOT NULL,
    quantity INT NOT NULL
) ENGINE=InnoDB;

INSERT INTO products (sku, name, unit_price, quantity) VALUES
    ('SKU-001', 'Notebook (old)', 10.00, 2),
    ('SKU-099', 'Legacy product', 5.00, 1);
