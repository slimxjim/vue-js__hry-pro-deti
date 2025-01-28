-- Vytvoření databáze
CREATE DATABASE `calculations` CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- Vytvoření uživatele s administrátorskými právy
CREATE USER 'admin4calc'@'localhost' IDENTIFIED BY 'MaWN5q6uUuRT.8P';

-- Přiřazení všech práv uživateli na databázi
GRANT ALL PRIVILEGES ON `calculations`.* TO 'admin4calc'@'localhost';

-- Aplikace práv
FLUSH PRIVILEGES;