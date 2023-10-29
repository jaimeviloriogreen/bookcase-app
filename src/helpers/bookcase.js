import sqlite3 from "sqlite3";

const getBooks = (sortby, orderby, len, posts)=>{
    return new Promise((resolve,reject)=>{

        const db = new sqlite3.Database("./src/database/bookcase.db");
        const sql =`
                SELECT
                    books.name AS book,
                    authors.name AS author,
                    categories.name AS categories,
                    purchasedOn
                FROM books
                    INNER JOIN authors ON books.author = authors.id
                    INNER JOIN categories ON books.category = categories.id
                    ORDER BY ${ orderby } ${ sortby } LIMIT ${ len - posts } OFFSET ${ posts }`;
        db.all(sql, (err, rows)=>{
            if( err ) return reject(err.message);
            resolve(rows);
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
const createDB = ()=>{
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

export{
    getBooks,
    insertBook,
    rowsCount,
    getSets,
    updateSettings,
    getBooksToActions,
    createDB,
    createTable,
    deleteBooks
}
