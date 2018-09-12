import axios from 'axios';
import {key, proxy} from '../config';

export default class Recipe{
    constructor(id){
        this.id = id;
    }

    async getRecipe(){
        try{ 
                const res = await axios(`${proxy}http://food2fork.com/api/get?key=${key}&rId=${this.id}`);
                this.title = res.data.recipe.title;
                this.author = res.data.recipe.publisher;
                this.img = res.data.recipe.image_url;
                this.url = res.data.recipe.source_url;
                this.ingredients = res.data.recipe.ingredients;
        }
        catch(e){
            console.log(`Error: ${e}`);
        }
    }

    calcTime(){
         const numIng = this.ingredients.length;
         const time = Math.ceil(numIng / 3);
         this.time = time * 15;
    }

    calcServings(){
        this.servings = 4;
    }

    parseIngredients(){
        const unitLong = ['tablespoons', 'tablespoon', 'ounces', 'ounce', 'teaspoons', 'teaspoon', 'cups', 'pounds'];
        const unitShort = ['tbsp', 'tbsp', 'oz', 'oz', 'tsp', 'tsp', 'cup', 'pound'];
        const units = [...unitShort, 'kg', 'g'];

        let objIng;
        //1. Uniform units
        const newIngredients = this.ingredients.map(el => {
            let ingredients = el.toLowerCase();
            
                unitLong.forEach((unit, index) => {
                    ingredients = ingredients.replace(unit, unitShort[index]);
            });

        //2. Remove parathesis
            ingredients = ingredients.replace(/ *\([^)]*\) */g, ' ');

        //3. Parse ingredient to unit, count and ingredients
            let arrIng = ingredients.split(" ");
            
            const unitIndex = arrIng.findIndex(el => unitShort.includes(el));

            if(unitIndex > -1){
                // There is a unit
                // Ex. 4 1/2 cups, arrCount is [4, 1/2] --> eval("4+1/2") --> 4.5
                // Ex. 4 cups, arrCount is [4]
                let count;
                const arrCount = arrIng.slice(0, unitIndex);
                if(arrCount.length == 1 ){
                    count = eval(arrIng[0]);
                } else {
                    count = eval(arrIng.slice(0, unitIndex).join('+'));
                }
                objIng = {
                    count,
                    unit : arrIng[unitIndex],
                    ingredients : arrIng.splice(unitIndex+1).join(' ')
                };

            } 
            else if(parseInt(arrIng[0] ,10)) {
                //No unit, 1st element is a number
                objIng = {
                    count : parseInt(arrIng[0] ,10),
                    unit : '',
                    ingredients : arrIng.splice(1).join(' ')
                };

            } 
            else if(unitIndex === -1){
                // No unit
                objIng = {
                    count : 1,
                    unit : '',
                    ingredients
                };
            } 
            return objIng;
         

        });
        this.ingredients = newIngredients;
    }

    updateServingIngredients(type) {

        //Update serving
        const newServings = type === 'dec' ? this.servings-1 : this.servings+1;

        //Update ingredients
        this.ingredients.forEach(ing => {
            ing.count *= (newServings / this.servings);
        });
        this.servings = newServings;
    }

}
