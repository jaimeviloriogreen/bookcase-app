import { mkdir } from 'node:fs';
import sqlite3 from "sqlite3";

const getBooks = (sortby, orderby, len, posts)=>{
    return new Promise((resolve,reject)=>{

        const db = new sqlite3.Database("./src/database/bookcase.db");
        const sql =`
                SELECT
                    books.name AS book,
                    authors.name AS author,
                    categories.name AS categories,
                    editorials.name AS editorials,
                    purchasedOn
                FROM books
                    INNER JOIN authors ON books.author = authors.id
                    INNER JOIN categories ON books.category = categories.id
                    INNER JOIN editorials ON books.editorial = editorials.id
                    ORDER BY ${ orderby } ${ sortby } LIMIT ${ len - posts } OFFSET ${ posts }`;
        db.all(sql, (err, rows)=>{
            if( err ) return reject(err.message);
            resolve(rows);
        });

        db.close();
    }); 
}
const getOneBook = (bookId)=>{
    return new Promise((resolve, reject)=>{
        const db = new sqlite3.Database("./src/database/bookcase.db");
        const sql =`
            SELECT
                books.name AS book,
                authors.name AS author,
                editorials.name AS editorial,
                categories.name AS categories,
                isbn,
                purchasedOn
            FROM books
                INNER JOIN authors ON books.author = authors.id
                INNER JOIN editorials ON books.editorial = editorials.id
                INNER JOIN categories ON books.category = categories.id
                WHERE books.id = ?`;
        
        db.get(sql, [ bookId ], (err, row)=>{
            if( err ) return reject(err.message);
            resolve(row);
        });

        db.close();
    });
}
const insertBook = (name, authors, editorial, categories, isbn, purchasedOn)=>{
    return new Promise((resolve, reject)=>{
        
        const db = new sqlite3.Database("./src/database/bookcase.db");
        
        db.serialize(()=>{
            db.run(`
                INSERT INTO categories(name)
                VALUES(?);
            `, [categories], (err)=>{ if( err ) return reject(err);});

             db.run(`
                INSERT INTO authors(name)
                VALUES(?);
            `, [authors],  (err)=>{ if( err ) return reject(err); });

             db.run(`
                INSERT INTO editorials(name)
                VALUES(?);
            `, [editorial],  (err)=> { if( err ) return reject(err); });

            db.run(`
            INSERT INTO
                books(name,isbn, purchasedOn,category,author,editorial)
            VALUES(?, ?, ?,
                (SELECT id FROM categories WHERE name = ?),
                (SELECT id FROM authors WHERE name = ?),
                (SELECT id FROM editorials WHERE name = ?));
            `, [name, isbn, purchasedOn, categories, authors, editorial], 
            function(err){
                if( err ) return reject(err);

                resolve(this.changes);
            });
            
            db.close(err =>{ if( err ) return  reject(err); });
        });

    });
}
const rowsCount = ()=>{
    return new Promise((resolve, reject)=>{
        const sql = "SELECT COUNT(*) AS 'rows' FROM books;"
        const db = new sqlite3.Database("./src/database/bookcase.db");

        db.get(sql, (err, row)=>{
            if( err ) return reject(err.message);
            resolve(row);
        });

         db.close();
    });
}
const getSets = ()=>{
    return new Promise((resolve, reject)=>{
        const sql = "SELECT post, sortby, orderby FROM settings;"
        const db = new sqlite3.Database("./src/database/bookcase.db");

        db.get(sql, (err, row)=>{
            if( err ) return reject(err.message);
            resolve(row);
        });

         db.close();
    });
}
const updateSettings = async(post, sortby, orderby)=>{
    return new Promise((resolve, reject)=>{
        const db = new sqlite3.Database("./src/database/bookcase.db");
        const sql = `UPDATE settings SET post = ?, sortby = ?, orderby = ? WHERE id = 1;`;
        const values = [post, sortby, orderby]
        db.run(sql,values, function(err){
            if( err ) return  reject(err.message);
            resolve(this.changes);
        });
    });
}
const getBooksToActions = ()=>{
    return new Promise((resolve,reject)=>{
        
        const db = new sqlite3.Database("./src/database/bookcase.db");
        const sql =`
                SELECT
                    books.id,
                    books.name AS book,
                    authors.name AS author
                FROM books
                    INNER JOIN authors ON books.author = authors.id`;
        db.all(sql, (err, rows)=>{
            if( err ) return reject(err.message);
            resolve(rows);
        });

        db.close();
    }); 
}
const createDBFolder = ()=>{
    mkdir('./src/database', { recursive: true }, (err) => {
        if (err) throw err;
    }); 
}
const createDB = ()=>{
    createDBFolder();
    
    return new Promise((resolve, reject)=>{
        const path = "./src/database/bookcase.db";

        const db = new sqlite3.Database(path, (err)=>{
            if( err ) return reject(err.message);
        });
        resolve(db);
    });
};
const createTable = async ()=>{
    return new Promise((resolve, reject)=>{
        const db = new sqlite3.Database("./src/database/bookcase.db");
        const categoriesTableSQL = `
        CREATE TABLE IF NOT EXISTS
        categories(
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL UNIQUE
        );`;
        const authorsTableSQL = `
        CREATE TABLE IF NOT EXISTS
        authors(
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL UNIQUE
        );`;
        const editorialTableSQL = `
        CREATE TABLE IF NOT EXISTS
        editorials(
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL UNIQUE
        );`;
        const settingsTableSQL = `
        CREATE TABLE IF NOT EXISTS
        settings(
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            post INTEGER NOT NULL,
            sortby TEXT NOT NULL,
            orderby TEXT NOT NULL
        );`;
        const settingsInsertSQL = `
         INSERT INTO settings(post, sortby, orderby) 
            SELECT 5, 'book', 'ASC' 
            WHERE NOT EXISTS (SELECT * FROM settings);
        `;
        const booksTableSQL = `
        CREATE TABLE IF NOT EXISTS
            books(
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                name TEXT NOT NULL UNIQUE,
                isbn TEXT NOT NULL UNIQUE,
                purchasedOn TEXT NOT NULL,
                category INTEGER NOT NULL,
                author INTEGER NOT NULL,
                editorial INTEGER NOT NULL, 
                FOREIGN KEY (category) REFERENCES categories(id) 
                    ON UPDATE CASCADE
                    ON DELETE CASCADE,
                FOREIGN KEY (author) REFERENCES authors(id)
                    ON UPDATE CASCADE
                    ON DELETE CASCADE,
                FOREIGN KEY (editorial) REFERENCES editorials(id)
                    ON UPDATE CASCADE
                    ON DELETE CASCADE
            );
        `;

        db.serialize(()=>{
            db.run("PRAGMA foreign_keys = ON;", (err)=>{
                if( err ) return reject(err.message);
            });
            db.run(settingsTableSQL, (err)=>{
                if( err ) return reject(err.message);
            });
            db.run(settingsInsertSQL, (err)=>{
                if( err ) return reject(err.message);
            })
            db.run(categoriesTableSQL, (err)=>{
                 if( err ) return reject(err.message);
            });
            db.run(authorsTableSQL, (err)=>{
                if( err ) return reject(err.message);
            });
            db.run(editorialTableSQL, (err)=>{
                if( err ) return reject(err.message);
            });
            db.run(booksTableSQL, (err)=>{
                if( err ) return reject(err.message);
            });
            db.close(err =>{
                if( err ) return reject(err.message);
            });
        });
        resolve("tables created!");
    });
};
const deleteBooks = (ids=[])=>{
    return new Promise((resolve, reject)=>{
        const db = new sqlite3.Database("./src/database/bookcase.db");
        
        let id = ids.map(_=> `?,`).join("").slice(0, -1);
        
        const sql = `DELETE FROM books WHERE id IN(${id});`
        
        db.run(sql, ids, function(err){
            if( err ) return reject(err.message);
            resolve(this.changes);
        });

        db.close();
    });
};

const updateOneBook = async({book, author, editorial, categories, isbn, purchasedOn}, bookId)=>{
    const db = new sqlite3.Database("./src/database/bookcase.db");

    const sql = {
        book:"UPDATE books SET name = ? WHERE id = ?",
        isbn:"UPDATE books SET isbn = ? WHERE id = ?",
        purchased:"UPDATE books SET purchasedOn = ? WHERE id = ?",
        categoryId:"SELECT id FROM categories WHERE name = ?", 
        authorId:"SELECT id FROM authors WHERE name = ?", 
        editorialId:"SELECT id FROM editorials WHERE name = ?", 
        categoryBook:"UPDATE books SET category = ? WHERE id = ?",
        authorBook:"UPDATE books SET author = ? WHERE id = ?",
        editorialBook:"UPDATE books SET editorial = ? WHERE id = ?",
        categoriesTable:"INSERT INTO categories(name) VALUES(?)",
        authorsTable:"INSERT INTO authors(name) VALUES(?)",
        editorialsTable:"INSERT INTO editorials(name) VALUES(?)",
    }
    db.serialize(()=>{
        db.run(sql.book, [ book, bookId ], (err)=>{ if( err ) return err;});
        db.run(sql.isbn, [ isbn, bookId ], (err)=>{ if( err ) return err;});
        db.run(sql.purchased, [ purchasedOn, bookId ], (err)=>{ if( err ) return err;});

        //? Category
        db.get(sql.categoryId, [categories], (err, row)=>{
            if( err ) return err;
            
            if(row){
                const { id } = row;
                db.run(sql.categoryBook, [id, bookId],()=>{ if( err ) return err;})
            }else{
                db.run(sql.categoriesTable,[categories], function(err){
                    if( err ) return err;
                    db.run(sql.categoryBook, [this.lastID, bookId],()=>{ if( err ) return err;})
                })
            }
        });
        //? Author
         db.get(sql.authorId, [author], (err, row)=>{
            if( err ) return err;
            if(row){ // If author exist
                const { id } = row;
                db.run(sql.authorBook, [id, bookId],()=>{ if( err ) return err;})
            }else{
                 db.run(sql.authorsTable,[author], function(err){
                    if( err ) return err;
                    db.run(sql.authorBook, [this.lastID, bookId],()=>{ if( err ) return err;})
                })
            }
        });
        //? Editorial
         db.get(sql.editorialId, [editorial], (err, row)=>{
            if( err ) return err;
            
            if(row){
                const { id } = row;
                db.run(sql.editorialBook, [id, bookId],()=>{ if( err ) return err;})
            }else{
                 db.run(sql.editorialsTable,[editorial], function(err){
                    if( err ) return err;
                    db.run(sql.editorialBook, [this.lastID, bookId],()=>{ if( err ) return err;})
                })
            }
        });
    });
}

export{
    getBooks,
    insertBook,
    rowsCount,
    getSets,
    updateSettings,
    getBooksToActions,
    createDB,
    createTable,
    deleteBooks,
    getOneBook, 
    updateOneBook
}
