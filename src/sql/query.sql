/** 
    SQLite3 Database 
 **/
PRAGMA foreign_keys = ON;
# Delete table Categories  if exist 
DROP TABLE categories;
#Create table Categories  
CREATE TABLE IF NOT EXISTS
    categories(
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL UNIQUE 
    );
# Delete table Authors if exist 
DROP TABLE authors;
#Create table Authors  
CREATE TABLE IF NOT EXISTS
    authors(
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL UNIQUE
    );
# Delete table Editorials if exist 
DROP TABLE editorials;
#Create table Editorials  
CREATE TABLE IF NOT EXISTS
    editorials(
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL UNIQUE
    );
# Delete table settings if exist
DROP TABLE settings;
#Create table settings 
CREATE TABLE IF NOT EXISTS
    settings(
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        post INTEGER NOT NULL,
        sortby TEXT NOT NULL,
        orderby TEXT NOT NULL
    );
# Delete table Book if exist 
DROP TABLE books;
#Create table Book
CREATE TABLE IF NOT EXISTS
    books(
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL UNIQUE,
        isbn TEXT NOT NULL UNIQUE,
        purchasedOn TEXT NOT NULL,
        category INTEGER REFERENCES categories(id) 
            ON UPDATE CASCADE
            ON DELETE CASCADE,
        author INTEGER REFERENCES authors(id)
            ON UPDATE CASCADE
            ON DELETE CASCADE,
        editorial INTEGER REFERENCES editorials(id)
            ON UPDATE CASCADE
            ON DELETE CASCADE
    );

# Insert Book
INSERT INTO
    books(name,isbn,purchasedOn,category,author,editorial)
VALUES(?, ?, ?,
    (SELECT id FROM categories WHERE name = ?),
    (SELECT id FROM authors WHERE name = ?),
    (SELECT id FROM editorials WHERE name = ?));

# Select all rows from table Book
SELECT
    books.name AS book,
    authors.name AS author,
    categories.name AS categories,
    editorials.name AS editorial,
    isbn, purchasedOn 
FROM books
    INNER JOIN authors ON books.author = authors.id
    INNER JOIN categories ON books.category = categories.id
    INNER JOIN editorials ON books.editorial = editorials.id
WHERE books.id = 1;

-- SQLITE no soporta UPDATE INNER JOIN
-- UPDATE books
--     INNER JOIN authors ON books.author = authors.id
--     INNER JOIN editorials ON books.editorial = editorials.id 
--     INNER JOIN categories ON books.category = categories.id
-- SET
--     books.name = 'Pedagogía General',
--     authors.name = 'Ricardo Nassif',
--     editorials.name = 'Pedagogía',
--     categories.name = 'Kaperlusz',
--     books.isbn = '950-13-3450-3',
--     books.purchasedOn = '9/6/2016'
-- WHERE books.id = 2;


-- UPDATE book name, isbn and purchasedOn 
UPDATE books SET 
    category = SELECT EXISTS(SELECT id FROM categories WHERE name = 'Historia')
WHERE id = '';

-- UPDATE book categories 
UPDATE categories SET name = '' WHERE id = ( SELECT category FROM books WHERE id = '' );

-- UPDATE book author
UPDATE authors
SET name = ''
WHERE id = (
        SELECT author
        FROM books
        WHERE id = ''
    );

-- UPDATE book editorial
UPDATE editorials
SET name = ''
WHERE id = (
        SELECT editorial
        FROM books
        WHERE id = ''
    );