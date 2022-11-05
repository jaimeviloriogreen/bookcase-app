export class Books{
    constructor(name, authors, editorial, categories, isbn, date){
        this.name = name;
        this.authors = authors;
        this.categories = categories;
        this.editorial = editorial;
        this.isbn = isbn;
        this.purchasedOn = new Date(date).toLocaleDateString('es-DO');
    }
}