import Books from "./models/Books.js";
import advise from "./modules/messages.js";
import setPostByPages from "./modules/pages.js";
import { 
    getBooks, 
    insertBook,
    deleteBooks, 
    rowsCount,
    getSets, 
    updateSettings,
    createDB,
    createTable
} from "./helpers/bookcase.js";
import {
    getChoice, 
    insertBookChoice, 
    getPage, 
    getSettings, 
    toDeleteChoices, 
    toUpdateBookChoice, 
    toUpdateBookInput
} from "./helpers/inquirer.js";

async function main(){
   try {
        await createDB();
        await createTable();
        
        advise("Welcome to my personal bookcase @pp!", "yellow");

        let option = "";

        do{
           
            option = await getChoice();
            const { rows }  = await rowsCount();

            switch (option) {
                case "1":
                    console.clear();
                    try {
                        const { rows }  = await rowsCount();
                        const {post, sortby, orderby} = await getSets();
                        const pages = await getPage(rows, post);
                        const {posts, len} = setPostByPages(rows, post, pages);
                        const books = await getBooks(orderby, sortby, len, posts);                
                        
                        console.table(books);

                    } catch (err) {
                        advise(`Error: nothing to show!`, "red");
                    }
                    break;
                case "2":
                    console.clear();
                    const { name, authors, editorial, categories, isbn, date, confirm } = await insertBookChoice();
                    
                    if( confirm ){
                        try {
                            const books = new Books(name, authors, editorial, categories, isbn, date);

                            const inserted = await insertBook(books.name, books.authors, books.editorial, books.categories, books.isbn, books.purchasedOn);
                            
                            if ( inserted > 0 ) {
                                advise("One book have been inserted!", "green")
                            };

                            break;
                        } catch (err) {
                            advise(`Error: ${ err }`, "red");
                        }
                    }
                            advise("Book have not been inserted!", "yellow");
                    break;
                case "3":
                     console.clear();
                    try {
                        if( rows <= 0 ) throw new Error("nothing to update!");

                        const { bookId, confirm } = await toUpdateBookChoice();
                        
                        if(confirm){
                            const res = await toUpdateBookInput(bookId);
                            console.log(res);
                        }else{

                            advise("Book have not been updated!", "yellow");
                        }

                    } catch (err) {
                        advise(err, "red");
                    }
                    break;
                case "4":
                    console.clear();
                    try {
                      
                        
                        if( rows <= 0 ) throw new Error("nothing to delete!");

                        const { books, confirm } = await toDeleteChoices();
                        
                        if(confirm){
                            const deleted = await deleteBooks(books);
                            
                            if( deleted  > 0 && deleted < 2) advise(`${deleted} book have been deleted!`, "green");
                            
                            if( deleted >= 2) advise(`${deleted} books have been deleted!`, "green");
                            
                        }else{
                            advise("Books have not been deleted!", "yellow");
                        }
                    } catch (err) {
                        advise(err, "red");
                    }
                    break;
                case "5":
                    console.clear();
                    try {
                        const {post, sortby, orderby, confirmation} = await getSettings();

                        if(confirmation){
                            const updated = await updateSettings(post, sortby, orderby);
                            
                            if(updated === 1){
                                advise("Set updated!", "green");
                            }
                            break;
                        }

                    } catch (err) {
                        console.log(`Error: ${ err }`);
                    }
                    advise("Nothing have been set!", "green");
                    break;
                default:
                    break;
            }
        }while(option != "6");

        advise('Session end!', "red");
   } catch (error) {
        console.log(error);
   }
}

main();



