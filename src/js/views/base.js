export const elements = {
    searchForm : document.querySelector('.search'),
    searchInput : document.querySelector('.search__field'),
    searchResList : document.querySelector('.results__list'),
    searchRes : document.querySelector('.results'),
    pageButton : document.querySelector('.results__pages'),
    recipe : document.querySelector('.recipe'),
    shoppingList : document.querySelector('.shopping__list'),
    likesList : document.querySelector('.likes__list'),
    likesMenu: document.querySelector('.likes__field')   
};

const elementString = {
    loader : 'loader'
};

export const renderLoader = parent => {
    const loader = `<div class = ${elementString.loader}>
                        <svg>
                            <use href="img/icons.svg#icon-cw"></use>
                        </svg>
                    </div>`;
    parent.insertAdjacentHTML('afterbegin', loader);
};

export const clearLoader = parent => {
    const loader = document.querySelector(`.${elementString.loader}`);
    if(loader) loader.parentElement.removeChild(loader);
};
