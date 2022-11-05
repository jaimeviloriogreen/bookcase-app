/** 
    SQLite3 Database 
 **/

# Delete table Categories  if exist 
DROP TABLE categories;
#Create table Categories  
CREATE TABLE
    categories(
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL
    );
# Delete table Authors if exist 
DROP TABLE authors;
#Create table Authors  
CREATE TABLE
    authors(
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL
    );
# Delete table Editorials if exist 
DROP TABLE editorials;
#Create table Editorials  
CREATE TABLE
    editorials(
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL
    );

# Delete table Book if exist 
DROP TABLE books;
#Create table Book
CREATE TABLE
    books(
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        isbn TEXT NOT NULL,
        purchasedOn TEXT NOT NULL,
        category INTEGER REFERENCES categories(id),
        author INTEGER REFERENCES authors(id),
        editorial INTEGER REFERENCES editorials(id)
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