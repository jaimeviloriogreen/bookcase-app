export default (documentCount, itemShows, pageSelected = 1)=>{
    const postNumber = documentCount;
    const items = itemShows;

    const pages = Math.ceil(postNumber / items);
    
    const posts = ((pageSelected * items) - items);

    if(pageSelected <= pages){
        const len = pageSelected * items;
        return {len, posts, pages}
    }  
}