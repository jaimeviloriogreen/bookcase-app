function validateName(value){
    const regex = new RegExp("^([a-zA-ZÀ-ÿ0-9]{2,}[,]?)(\\s[a-zA-ZÀ-ÿ0-9]+[,]?)*$", "g");
    if(regex.test(value)){
        return true;
    }
    return "Please, enter a validate book name!"
}

function validateAuthor(value){
    const regex = new RegExp("^([a-zA-ZÀ-ÿ.]{2,}[,]?)(\\s[a-zA-ZÀ-ÿ.]+[,]?)*$", "g");
    if(regex.test(value)){
        return true;
    }
    return "Please, enter a validate author!"
}

function validateEditorial(value){
    const regex = new RegExp("^([a-zA-ZÀ-ÿ&]{2,})(\\s[a-zA-ZÀ-ÿ]+)*$", "g");
    if(regex.test(value)){
        return true;
    }
    return "Please, enter a validate editorial!"
}

function validateCategory(value){
    const regex = new RegExp("^([a-zA-ZÀ-ÿ]{2,}[,]?)(\\s[a-zA-ZÀ-ÿ]+[,]?)*$", "g");
    if(regex.test(value)){
        return true;
    }
    return "Please, enter a validate category!"
}

function validateIsbn(value){
    const regex = new RegExp("^([0-9\\-]+)([0-9]+)$", "g");
    if(regex.test(value)){
        return true;
    }
    return "Please, enter a validate ISBN!"
}

function validateDate(value){
    const regex = new RegExp("^[0-9]{4}[/]{1}[0-9]{1,2}[/]{1}[0-9]{1,2}$", "g");
    const options = { year: 'numeric', month: '2-digit', day: '2-digit' }
    const date = new Date(value).toLocaleDateString('es-DO', options);

    if(regex.test(value) && date !== "Invalid Date"){
        return true;
    }

    return "Please, enter a validate date!"
}


export{
    validateName, 
    validateAuthor, 
    validateEditorial, 
    validateCategory, 
    validateIsbn, 
    validateDate
}