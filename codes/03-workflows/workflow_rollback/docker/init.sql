CREATE SCHEMA demo;
CREATE TABLE demo.invoices (id INTEGER PRIMARY KEY, amount INTEGER NOT NULL CHECK (amount >= 0));
CREATE TABLE demo.payments (id INTEGER PRIMARY KEY, amount INTEGER NOT NULL CHECK (amount >= 0));
INSERT INTO demo.invoices VALUES (1, 100);
INSERT INTO demo.payments VALUES (1, 100);
