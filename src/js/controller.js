///////////////
///Forkifiy////
///////////////
// Add polyfills to ES6 to enable our application supported on old browsers
import 'core-js/stable'; // for polyfiling everthing else
import 'regenerator-runtime/runtime'; // for polyfilling async/await

import * as model from './model.js';
import searchView from './views/searchView.js';
import recipeView from './views/recipeView.js';
import resultsView from './views/resultsView.js';
import paginationView from './views/paginationView.js';
import bookmarksView from './views/bookmarksView.js';
import addRecipeView from './views/addRecipeView.js';
import { MODAL_CLOSE_SEC } from './config.js';

const recipeContainer = document.querySelector('.recipe');


if (module.hot) {
  module.hot.accept();
}
////////////////////////////////////////
// https://forkify-api.herokuapp.com/v2
////////////////////////////////////////


const controlRecipes = async function () {
  try {
    //  Getting the recipe id from the url
    const id = window.location.hash.slice(1); // to remove the hash symbol from the id
    if (!id) return; // when there is indeed no id
    recipeView.renderSpinner(); // Loading spinner

    // 0. Update bookmarks view
    bookmarksView.update(model.state.bookmarks);

    // 1. Update the results view to mark selected search result
    // resultsView.render(model.getSearchResultsPage()); // this also works fine but it re-renders every thing we have but we want only the changed part to be re-rendered
    resultsView.update(model.getSearchResultsPage());

    // 2. Loading recipe
    await model.loadRecipe(id); // as 

    // 3. Rendering recipe
    recipeView.render(model.state.recipe);
    // const recipeView = new RecipeView(model.state.recipe); // if we did not use export default in the 

  } catch (err) {
    console.error(`${ err.message }🎆🎆🎆`);
    recipeView.renderError();
  }
};
// controlRecipes();

const controlSearchResults = async function () {
  try {
    resultsView.renderSpinner();
    // console.log(resultsView);
    // 1. Get query
    const query = searchView.getQuery();
    if (!query) return; // guard clause

    // 2. Load search reasults
    await model.loadSearchResults(`${ query }`);

    // 3. Render results
    // resultsView.render(model.state.search.results); // before applying pagination
    resultsView.render(model.getSearchResultsPage());

    // 4. Render pagination Page
    paginationView.render(model.state.search);
  } catch (err) {
    console.log(err);
    resultsView.renderError();
    throw err;
  }
};
// controlSearchResults(); // we are using the publisher-subscriber pattern and so lets call this function inside the init function after listening for the the form submission in the search view

const controlPagination = function (goToPage) {
  // 1. Render NEW results
  resultsView.render(model.getSearchResultsPage(goToPage));

  // 4. Render NEW pagination buttons
  paginationView.render(model.state.search);
};

const controlServings = function (newServings) {
  // 1. update ingredients quantity
  model.updateServings(newServings);

  // 2. re-render recipes
  // recipeView.render(model.state.recipe);
  recipeView.update(model.state.recipe); //! only updates texts and attributes in the dom without re-rendering the entire view
};

const controlAddBookmark = function (recipe) {
  // console.log(model.state.recipe); 
  // 1. Add/remove bookmark
  if (!model.state.recipe.bookmarked)
    model.addBookmark(model.state.recipe);
  else
    model.deleteBookmark(model.state.recipe.id);
  // 2. Render recipe
  recipeView.update(model.state.recipe);

  // Render bookmarks
  bookmarksView.render(model.state.bookmarks);
};


// When we try to render the bookmarks at the start it ejects this error ;) ERROR: Cannot set properties of undefined (setting 'textContent')🎆🎆🎆. And so to avoid this we create another handler function called addHandlerRenderBookmark in the bookmarksView to render the bookmarks as soon as the page loads
const controlBookmarks = function () {
  // ! will initiate the bookmarks to be rendered as the page loads
  bookmarksView.render(model.state.bookmarks);
};


const controlAddRecipe = async function (newRecipe) {
  try {
    // Show uploading spinner
    addRecipeView.renderSpinner();

    // Upload the new recope data
    await model.uploadRecipe(newRecipe);
    console.log(model.state.recipe);

    // Render recipe
    addRecipeView.render(model.state.recipe);

    // Display Success meesage
    addRecipeView.renderMessage();

    // Re-render the bookmarks view
    bookmarksView.render(model.state.bookmarks);

    // Change the ID in the URL
    window.history.pushState(null, '', `#${ model.state.recipe.id }`); // state, title, id
    // window.history.back()

    // Close from window
    setTimeout(function () {
      addRecipeView.toggleWindow();
    }, MODAL_CLOSE_SEC * 1000);
  } catch (err) {
    // console.error(err);
    addRecipeView.renderError('Problem with the Forkify API');
  }
};

// Simulating git bramch
const newFeature = function () {
  console.log('Welcome to Forkify Application');
};
// Publisher-Subscriber Pattern
const init = function () {
  bookmarksView.addHandlerRenderBookmark(controlBookmarks);
  recipeView.addHandlerRender(controlRecipes);
  recipeView.addHandlerUpdtaeServings(controlServings);
  recipeView.addHandlerAddBookmark(controlAddBookmark);
  searchView.addHandlerSearch(controlSearchResults);
  paginationView.addHandlerClick(controlPagination);
  addRecipeView.addHandlerUpload(controlAddRecipe);
  newFeature()
};
init();


// [ 'hashchange', 'load' ].forEach(event => window.addEventListener(event, controlRecipes)); // to make it clean
// window.addEventListener('hashchange', controlRecipes); // listening tol url change
// window.addEventListener('hashchange', controlRecipes); // to render a recipe from the start on another tab(by copying and pasting the url)

///////////////////////
///Ehenew Amogne///////
///November 27,2017////
///////////////////////


