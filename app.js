import { Books } from "./models/Books.js";
import { 
    getBooks, 
    insertBook, 
    rowsCount,
    startSettings, 
    getSets, 
    updateSettins 
} from "./helpers/bookcase.js";
import advise from "./modules/messages.js";
import setPostByPages from "./modules/pages.js";
import {getChoice, setBook, getPage, getSettings} from "./helpers/inquirer.js";

async function main(){
    await startSettings();
    
    advise("Welcome to my personal bookcase @pp!", "yellow");

    let option = "";

    do{
        option = await getChoice();
        
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
            const { name, authors, editorial, categories, isbn, date, confirm } = await setBook();
            
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
            try {
                const {post, sortby, orderby, confirmation} = await getSettings();

                if(confirmation){
                    const updated = await updateSettins(post, sortby, orderby);
                    
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
}

main();



