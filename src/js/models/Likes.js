export default class Likes {
    constructor(){
        this.likes = [];
    }

    //Add item to likes
    addLikes(id, img, title, author){
        const like = {
            id,
            img,
            title,
            author
        };
        this.likes.push(like);
        this.persistData();
        return like;
    }

    //Delete item from likes
    deleteLikes(id){
        const index = this.likes.findIndex(el => el.id === id);
        this.likes.splice(index, 1);
        this.persistData();
    }

    //isLiked
    isLiked(id){
        // if(!this.likes.findIndex(el => el.id === id)){
        //     console.log('Already Liked');
        //     return true;
        // }
        // console.log('Liked Now');
        // return false;
        return this.likes.findIndex(el => el.id === id) !== -1;
    }

    //Number of likes
    numList(){
        return this.likes.length;
    }

    persistData(){
        console.log('persistData' + this.likes);
        localStorage.setItem('likes', JSON.stringify(this.likes));
    }

    getData(){
        const item = JSON.parse(localStorage.getItem('likes'));
        if(item) this.likes = item;
    }


}