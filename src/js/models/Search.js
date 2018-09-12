import axios from 'axios';
import {key, proxy} from '../config';

export default class Search{

    constructor(query){
        this.query = query;
    }

    async getResults(){
        
        try{
            const recipe = await axios(`${proxy}http://food2fork.com/api/search?key=${key}&q=${this.query}`);
            this.result = recipe.data.recipes;
        }
        catch(e) {
            console.log('Error!!!');
        }
    }  
}
