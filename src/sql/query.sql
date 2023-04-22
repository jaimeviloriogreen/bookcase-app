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
        name TEXT NOT NULL
    );
# Delete table Authors if exist 
DROP TABLE authors;
#Create table Authors  
CREATE TABLE IF NOT EXISTS
    authors(
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL
    );
# Delete table Editorials if exist 
DROP TABLE editorials;
#Create table Editorials  
CREATE TABLE IF NOT EXISTS
    editorials(
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL
    );
# Delete table settings if exist
DROP TABLE editorials;
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
        name TEXT NOT NULL,
        isbn TEXT NOT NULL,
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
    categories.name AS categories
FROM books
    INNER JOIN authors ON books.author = authors.id
    INNER JOIN categories ON books.category = categories.id;