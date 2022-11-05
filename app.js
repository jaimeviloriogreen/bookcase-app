import { Books } from "./models/Books.js";
import { getBooks, insertBook } from "./helpers/bookcase.js";
import advise from "./modules/messages.js";
import pagination from "./modules/pages.js";
import {getChoice, setBook, getPage, getSettings} from "./helpers/inquirer.js";

async function main(){
    advise("Welcome to my personal bookcase @pp!", "yellow");

    let option = "";

    do{
        option = await getChoice();
    switch (option) {
        case "1":
            console.clear();
        
            try {
                
                console.log(pages);
                const books = await getBooks();
                console.table(books);
            } catch (err) {
                console.log(`Error: ${ err }`);
            }
            
            break;
        case "2":
            console.clear();
            const { name, authors, editorial, categories, isbn, date, confirm } = await setBook();


            console.log(name, authors, editorial, categories, isbn, date, confirm );
            
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
                    advise("Book have not been inserted!", "green");
            break;
        case "5":
            console.clear();

            break;
        default:
            break;
    }

    }while(option != "6");

    advise('Session end!', "red");
}

// main();



