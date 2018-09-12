import { elements }  from './base';

export const addLike = (itemLike) => {
    const markup = `
            <li>
                <a class="likes__link" href="#${itemLike.id}">
                    <figure class="likes__fig">
                        <img src="${itemLike.img}" alt="${itemLike.title}">
                    </figure>
                    <div class="likes__data">
                        <h4 class="likes__name">${itemLike.title}</h4>
                        <p class="likes__author">${itemLike.author}</p>
                    </div>
                </a>
            </li>`;
    elements.likesList.insertAdjacentHTML('beforeend', markup);
};

export const toggleLikeBtn = isLiked => {
    const iconString = isLiked ? 'icon-heart' : 'icon-heart-outlined';
    document.querySelector('.recipe__love use').setAttribute('href', `img/icons.svg#${iconString}`);
};

export const deleteLike = (id) => {
    const item = document.querySelector(`.likes__link[href*='#${id}']`);
    if(item) item.parentElement.removeChild(item);
};

export const toggleLikeMenu = (numLikes) => {
    elements.likesMenu.style.visibility = numLikes > 0 ? 'visible' : 'hidden';
};