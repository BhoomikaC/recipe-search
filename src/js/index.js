import Search from './models/Search';
import * as searchView from './views/searchView';
import * as recipeView from './views/recipeView';
import * as listView from './views/listView';
import * as likesView from './views/likesView';
import {elements, renderLoader, clearLoader} from './views/base';
import Recipe from './models/Recipe';
import List from './models/List';
import Likes from './models/Likes';

/* 
* Global state of the app
* - Search object
* - Recipe object
* - List object
* - Likes object
*/

const state = {};

window.l = state;
/*** 
 * SEARCH CONTROLLER
 ***/ 

const controlSearch = async () => {

    // 1. Get query from view
    const query = searchView.getInput(); 


    if(query){
        // 2. add search object to state
        state.search = new Search(query);

        // 3) Prepare UI for results
        searchView.clearInput();
        searchView.clearSearch();

        // 4) Search for recipes
        renderLoader(elements.searchRes);
        await state.search.getResults();
        clearLoader(elements.searchRes);

        // 5) Render results on UI
        searchView.renderResults(state.search.result);
    }
}

elements.searchForm.addEventListener('submit', e => {
    e.preventDefault();
    controlSearch();
});

elements.searchForm.addEventListener('load', e => {
    e.preventDefault();
    controlSearch();
});
elements.pageButton.addEventListener('click', e => {
    const btn = e.target.closest('.btn-inline');
    if(btn){
        searchView.clearSearch();
        const goTo = parseInt(btn.dataset.goto ,10);
        searchView.renderResults(state.search.result, goTo);
    }

});

/*** 
 * RECIPE CONTROLLER
 ***/ 
const controlRecipe = async() => {
    const id = window.location.hash.replace('#','');
    if(id){

        //Prepare UI for changes
        recipeView.clearRecipe();
        renderLoader(elements.recipe);
        //console.log(id);
       

        //Get recipe
        //try{
            state.recipe = new Recipe(id);
            await state.recipe.getRecipe();
            //console.log(state.recipe);
            state.recipe.calcTime();
            state.recipe.calcServings();
            state.recipe.parseIngredients();
            //console.log(state.recipe);
            //Render recipe
            clearLoader();
            recipeView.renderRecipe(state.recipe, state.likes.isLiked(id));
            if (state.search) searchView.highlight(id);
       // }
        // catch(err){
        //     alert("Error in processsing!");
        // }
    }
}

/*** 
 * LIST CONTROLLER
 ***/ 

const controlList = () => {
    if(!state.list) state.list = new List();
    state.recipe.ingredients.forEach(el => {
        const item = state.list.addItem(el.count, el.unit, el.ingredients);
        listView.renderItem(item);
    });
};

elements.shoppingList.addEventListener('click', e => {
    const id = e.target.closest('.shopping__item').dataset.itemid;
    if(e.target.matches('.shopping__delete, .shopping__delete *')){
        state.list.deleteItem(id);
        listView.deleteItem(id);
    }
    else if(e.target.matches('.shopping__count, .shopping__count *')){
        const val = parseFloat(e.target.value, 10);
        state.list.updateItem(id, val);
    }
});

/*** 
 * LIKES CONTROLLER
 ***/ 

const controlLikes = () => {
    if(!state.likes) state.likes = new Likes();
    const currentID = state.recipe.id;
    
    if(!state.likes.isLiked(currentID)){
        
        // Add like to state
        const newLike = state.likes.addLikes(state.recipe.id, state.recipe.img, state.recipe.title, state.recipe.author);
        
        // Toggle the like button
        likesView.toggleLikeBtn(true);

        // Add like to UI list
        likesView.addLike(newLike);

    }
    else{ 
        //User has liked
        // Remove like from the state
        state.likes.deleteLikes(currentID);

        // Toggle the like button
        likesView.toggleLikeBtn(false);

        // Remove like from UI list
        likesView.deleteLike(currentID);
    }
    likesView.toggleLikeMenu(state.likes.numList());
    console.log(state.likes);
};

//Like button on loaad
window.addEventListener('load', () => {
    state.likes = new Likes();
    
    // Restore likes
    state.likes.getData();   

    // Toggle like menu button
    likesView.toggleLikeMenu(state.likes.numList());

    // Render the existing likes
    state.likes.likes.forEach(el => likesView.addLike(el));
});


['hashchange','load'].forEach(e => window.addEventListener(e,controlRecipe));

elements.recipe.addEventListener('click', e => {

        if(e.target.matches('.btn-decrease , .btn-decrease *')){
            if(state.recipe.servings > 1){
                state.recipe.updateServingIngredients('dec');
                recipeView.updateServeIngredients(state.recipe);
            }
        } else if(e.target.matches('.btn-increase , .btn-increase *')){
            state.recipe.updateServingIngredients('inc');
            recipeView.updateServeIngredients(state.recipe);
        }
        if(e.target.matches('.recipe__btn, .recipe__btn *')){
            controlList();
        }

        //Likes
        if(e.target.matches('.recipe__love, .recipe__love *')){
            controlLikes();
        }
});
