import { async } from "regenerator-runtime";
import { API_URL, KEY } from "./config.js";
import { RES_PER_PAGE } from "./config.js";
// import { getJSON, sendJSON } from "./helpers.js";
import { AJAX } from "./helpers.js";

export const state = {
  recipe: {},
  search: {
    query: '',
    results: [],
    page: 1,
    resultsPerPage: RES_PER_PAGE,
  },
  bookmarks: []
};

const createRecipeObject = function (data) {
  // let recipe = data.data.recipe;  
  const { recipe } = data.data;
  return {
    id: recipe.id,
    title: recipe.title,
    publisher: recipe.publisher,
    sourceUrl: recipe.source_url,
    image: recipe.image_url,
    cookingTime: recipe.cooking_time,
    servings: recipe.servings,
    ingredients: recipe.ingredients,
    ...(recipe.key && { key: recipe.key }) // to add a key property only if it exists
  };
};

export const loadRecipe = async function (id) {
  try {
    const data = await AJAX(`${ API_URL }/${ id }`);

    state.recipe = createRecipeObject(data);

    if (state.bookmarks.some(bookmark => bookmark.id === id))
      state.recipe.bookmarked = true;
    else
      state.recipe.bookmarked = false;

  } catch (err) {
    console.error(`${ err } 🎆🎆🎆`);
    throw err;
  }
};

export const loadSearchResults = async function (query) {
  try {
    state.search.query = query;
    const data = await AJAX(`https://forkify-api.herokuapp.com/api/search?q=${ query }&key=${ KEY }`);
    // console.log(data.recipes);

    state.search.results = data.recipes.map(recp => {
      return {
        id: recp.id,
        title: recp.title,
        publisher: recp.publisher_url,
        image: recp.image_url,
        ...(recp.key && { key: recp.key })
      };
    });
    // console.log(state.search.results);
    state.search.page = 1;
  } catch (err) {
    console.log(err);
    throw err;
  }
};

export const getSearchResultsPage = function (page = state.search.page) {
  state.search.page = page;

  const start = (page - 1) * state.search.resultsPerPage;
  const end = page * state.search.resultsPerPage;
  // console.log(start, end);

  return state.search.results.slice(start, end);
};

export const updateServings = function (newServings) {
  state.recipe.ingredients.forEach(ing => {
    ing.quantity = ing.quantity * newServings / state.recipe.servings;
    // newQuantity = (oldQuantity * newServings) / oldServings
  });

  state.recipe.servings = newServings;
};


const persistBookmarks = function () {
  localStorage.setItem('bookmarks', JSON.stringify(state.bookmarks));
};

export const addBookmark = function (recipe) {
  // Add bookmark
  state.bookmarks.push(recipe);

  // Mark the current recipe as bookmarked
  if (recipe.id === state.recipe.id) state.recipe.bookmarked = true;

  persistBookmarks();
};


export const deleteBookmark = function (id) {
  // Delete bookmark
  const index = state.bookmarks.findIndex(el => el.id === id);
  state.bookmarks.splice(index, 1);

  // Mark the current recipe as NOT bookmarked
  if (id === state.recipe.id) state.recipe.bookmarked = false;
  persistBookmarks();
};

// console.log(state.bookmarks);
const clearBookmarks = function () {
  localStorage.clear('bookmarks');
};
// clearBookmarks()


export const uploadRecipe = async function (newRecipe) {
  try {
    const ingredients = Object.entries(newRecipe)
      .filter(entry => entry[ 0 ].startsWith('ingredient' && entry[ 1 ] !== ''))
      .map(ing => {
        const ingArr = ing[ 1 ].split(',').map(el => el.trim());
        // const ingArr = ing[ 1 ].replaceAll(' ', '').split(',');

        if (ingArr.length !== 3) throw new Error('Invalid ingredient format!. Please use the correct format ;)');

        const [ quantity, unit, description ] = ingArr;
        return { quantity: quantity ? +quantity : null, unit, description };
      });

    const recipe = {
      title: newRecipe.title,
      source_url: newRecipe.sourceUrl,
      image_url: newRecipe.image,
      publisher: newRecipe.publisher,
      cooking_time: +newRecipe.cookingTime,
      servings: +newRecipe.servings,
      ingredients,
    };
    // console.log(recipe);

    // Let's upload our recipe to  the forkify api
    const data = await AJAX(`${ API_URL }?key=${ KEY }`, recipe);
    console.log(data);
    state.recipe = createRecipeObject(data);
    addBookmark(state.recipe);
  } catch (err) {
    throw err;
  }
};

const init = function () {
  const storage = localStorage.getItem('bookmarks');
  // console.log(JSON.parse(storage));
  if (storage) state.bookmarks = JSON.parse(storage);
};
init();