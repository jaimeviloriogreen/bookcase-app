import sqlite3 from "sqlite3";


export const getBooks = (sortby, orderby, len, posts)=>{
    return new Promise((resolve,reject)=>{

        console.log(len, posts);

        const db = new sqlite3.Database("./database/bookcase.db");
        const sql =`
                SELECT 
                    books.name AS book,
                    authors.name AS author,
                    categories.name AS categories,
                    purchasedOn
                FROM books
                    INNER JOIN authors ON books.author = authors.id
                    INNER JOIN categories ON books.category = categories.id
                    ORDER BY ${orderby} ${sortby} LIMIT ${len - posts} OFFSET ${posts }`;
        db.all(sql, (err, rows)=>{
            if( err ) return reject(err.message);
            resolve(rows);
        });

        db.close();
    }); 
}
export const insertBook = (name, authors, editorial, categories, isbn, purchasedOn)=>{
    return new Promise((resolve, reject)=>{
        
        const db = new sqlite3.Database("./database/bookcase.db");
        
        db.serialize(()=>{
            db.run(`
                INSERT INTO categories(name)
                SELECT ?
                WHERE NOT EXISTS(
                SELECT name FROM categories WHERE name = ?);
            `, [categories, categories]);

             db.run(`
                INSERT INTO authors(name)
                SELECT ?
                WHERE NOT EXISTS(
                SELECT name FROM authors WHERE name = ?);
            `, [authors, authors]);

             db.run(`
                INSERT INTO editorials(name)
                SELECT ?
                WHERE NOT EXISTS(
                SELECT name FROM editorials WHERE name = ?);
            `, [editorial, editorial]);

            db.run(`
            INSERT INTO
                books(name,isbn, purchasedOn,category,author,editorial)
            VALUES(?, ?,?,
                (SELECT id FROM categories WHERE name = ?),
                (SELECT id FROM authors WHERE name = ?),
                (SELECT id FROM editorials WHERE name = ?));
            `, [name, isbn, purchasedOn, categories, authors, editorial], 
            function(err){
                if( err ) return reject(err.message);

                resolve(this.changes);
            });
            
            db.close(err =>{
                if( err ) return  reject(err.message);
            });

        });

    });
}

export const rowsCount = ()=>{
    return new Promise((resolve, reject)=>{
        const sql = "SELECT COUNT(*) AS 'rows' FROM books;"
        const db = new sqlite3.Database("./database/bookcase.db");

        db.get(sql, (err, row)=>{
            if( err ) return reject(err.message);
            resolve(row);
        });

         db.close();
    });
}

export const getSets = ()=>{
    return new Promise((resolve, reject)=>{
        const sql = "SELECT post, sortby, orderby FROM settings;"
        const db = new sqlite3.Database("./database/bookcase.db");

        db.get(sql, (err, row)=>{
            if( err ) return reject(err.message);
            resolve(row);
        });

         db.close();
    });
}

export const updateSettins = async(post, sortby, orderby)=>{
    return new Promise((resolve, reject)=>{
        const db = new sqlite3.Database("./database/bookcase.db");
        const sql = `UPDATE settings SET post = ?, sortby = ?, orderby = ? WHERE id = 1;`;
        const values = [post, sortby, orderby]
        db.run(sql,values, function(err){
            if( err ) return  reject(err.message);
            resolve(this.changes);
        });
    });
}
