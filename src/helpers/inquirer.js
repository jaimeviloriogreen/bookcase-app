import inquirer from "inquirer";
import setPostByPages from "../modules/pages.js";
import { getBooksToActions, getOneBook } from "./bookcase.js";

import "colors";
const getChoice = async ()=>{
    const question = {
        type:"list",
        name:"choice",
        message:"Choice what do you want to do...",
     
        choices:[
            {value:"1", name:"1. Show all my books"},
            {value:"2", name:"2. Insert new book"},
            {value:"3", name:"3. Update a book"},
            {value:"4", name:"4. Delete a book"},
            {value:"5", name:"5. Settings"},
            {value:"6", name:"6. Exit"}
            
        ]
    };
    const {choice} = await inquirer.prompt(question);
    return choice;
}

const insertBookChoice = async ()=>{
    const question = [
        {
            type:"input", 
            name:"name",
            message:"Insert the book's name...",
            validate(value){
                const regex = new RegExp("^([a-zA-ZÀ-ÿ0-9]{2,}[,]?)(\\s[a-zA-ZÀ-ÿ0-9]+[,]?)*$", "g");
                if(regex.test(value)){
                    return true;
                }
                return "Please, enter a validate value!"
            }
        },
        {
            type:"input", 
            name:"authors",
            message:"Insert one o more book's authors (separated by commas and spaces)...",
            validate(value){
                const regex = new RegExp("^([a-zA-ZÀ-ÿ.]{2,}[,]?)(\\s[a-zA-ZÀ-ÿ.]+[,]?)*$", "g");
                if(regex.test(value)){
                    return true;
                }
                return "Please, enter a validate value!"
            }
        },

        {
            type:"input", 
            name:"editorial",
            message:"Insert the book's editorial...",
            validate(value){
                const regex = new RegExp("^([a-zA-ZÀ-ÿ&]{2,})(\\s[a-zA-ZÀ-ÿ]+)*$", "g");
                if(regex.test(value)){
                    return true;
                }
                return "Please, enter a validate value!"
            }
        },
        {
            type:"input", 
            name:"categories",
            message:"Insert one o more book categories (separated by commas and spaces)...",
            validate(value){
                const regex = new RegExp("^([a-zA-ZÀ-ÿ]{2,}[,]?)(\\s[a-zA-ZÀ-ÿ]+[,]?)*$", "g");
                if(regex.test(value)){
                    return true;
                }
                return "Please, enter a validate value!"
            }
        },
        {
            type:"input", 
            name:"isbn",
            message:"Insert the book's ISBN...",
            validate(value){
                const regex = new RegExp("^([0-9\\-]+)([0-9]+)$", "g");
                if(regex.test(value)){
                    return true;
                }
                return "Please, enter a validate ISBN!"
            }
        },
        {
            type:"input", 
            name:"date",
            message:"Insert day the book was purchased...",
            default(){
                return "year/month/day";
            },
            validate(value){
                const regex = new RegExp("^[0-9]{4}[/]{1}[0-9]{1,2}[/]{1}[0-9]{1,2}$", "g");
                const options = { year: 'numeric', month: '2-digit', day: '2-digit' }
                const date = new Date(value).toLocaleDateString('es-DO', options);

                if(regex.test(value) && date !== "Invalid Date"){
                    return true;
                }

                return "Please, enter a validate date!"
            }
        },
        {
            type:"confirm", 
            name:"confirm",
            message:"Do you want to insert and save this?".green,
            default(){
                return true;
            }
        },

    ]

    const answers = await inquirer.prompt(question);
    return answers;
}

const getPage = async (count, post)=>{
    const choices = [];

    const { pages } = setPostByPages(count, post);

    for(let i = 1; i <= pages; i++){
        choices.push({value:`${i}`, name:`Page ${i}`})
    }
    const question = {
        type:"list",
        name:"page",
        message:"Select the page number to show...",
        choices
    };
    const {page} = await inquirer.prompt(question);
    return page;
}

const getSettings = async ()=>{
    const question = [
        {
            type:'list',
            message:'Select how many books by pages you want to show...',
            name:'post',
            choices:[
                {value:5, name:"5"},
                {value:10, name:"10"},
                {value:15, name:"15"}
            ]
        },
        {
            type: 'list',
            name: 'sortby',
            message: 'Sort results by...',
            choices:[
                {value:"book", name:"Book name"},
                {value:"author", name:"Book authors"}
            ]
        },
        {
            type: 'list',
            name: 'orderby',
            message: 'Sort results order by...',
            choices:[
                {value:'ASC', name:"Ascending"},
                {value:'DESC', name:"Descending"}
            ]
        },
        {
            type:"confirm", 
            name:"confirmation",
            message:"Do you want to save these settings?".green,
            default(){
                return true;
            }
        }
    ]

    const settings = await inquirer.prompt(question);
    return settings;
}

const toDeleteChoices = async()=>{
    
    const bookToChoice = await getBooksToActions();
    const bookChoices = bookToChoice.map(({id, book, author})=>({value:id, name:`${book}, ${author}`}));
    
    const question = [
        {
            type:"checkbox",
            name:"books",
            message:"Choice the book(s) to delete!",
            choices:[
                new inquirer.Separator(' ==== Delete one o more books ==== '.green),
                ...bookChoices
            ],
            validate(answer){
                if (answer.length < 1) {
                    return 'You must choose at least one book!'.red;
                }

                return true;
            }
        },
        {
            type:"confirm", 
            name:"confirm",
            message:"¿Are you sure?".green,
            default(){
                return true;
            }
        },
    ]
               
    return await inquirer.prompt(question);
}

const toUpdateBookChoice = async ()=>{
    const bookToChoice = await getBooksToActions();
    
    const bookChoices = bookToChoice.map(({id, book, author})=>({value:id, name:`${book}, ${author}`}));
  
    const question = [
        {
            type:"list",
            name:"bookId",
            message:"Choice the book to update! ",
            suffix:"(press <enter> to select)".yellow,
            choices:[
                new inquirer.Separator(' ==== Update a Book ==== '.green),
                ...bookChoices
            ],
            validate(answer){
                if (answer.length < 1) {
                    return 'You must choose at least one book!'.red;
                }

                return true;
            }
        },
        {
            type:"confirm", 
            name:"confirm",
            message:"¿Are you sure?".green,
            default(){
                return true;
            }
        }
    ]
               
    return await inquirer.prompt(question);
}

const toUpdateBookInput = async (bookId)=>{
    const { book, author, editorial, categories, isbn, purchasedOn } = await getOneBook(bookId);
    
    const question = [
        {
            type:"input",
            name:"book",
            message:"Insert a new book's name...", 
            default(){
                return book
            }
        },
        {
            type:"input",
            name:"author",
            message:"Insert a new author's name...", 
            default(){
                return author
            }
        },
        {
            type:"input",
            name:"editorial",
            message:"Insert a new editorial's name...", 
            default(){
                return editorial
            }
        },
        {
            type:"input",
            name:"categories",
            message:"Insert a new categories name...", 
            default(){
                return categories
            }
        },
        {
            type:"input",
            name:"isbn",
            message:"Insert a new isbn's name...", 
            default(){
                return isbn
            }
        },
        {
            type:"input",
            name:"purchasedOn",
            message:"Insert a new purchasedOn's name...", 
            default(){
                return purchasedOn
            }
        }
    ]

    return await inquirer.prompt(question);
}

export{getChoice, insertBookChoice, getPage, getSettings, toDeleteChoices, toUpdateBookChoice, toUpdateBookInput}
