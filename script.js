'use strict';
const ApiKey = "da3990ba53msh012b5622713bbf1p10da1ajsn6bb2c0e4fdd4";
const searchURL = 'https://spoonacular-recipe-food-nutrition-v1.p.rapidapi.com/recipes/'

function formatQueryParams(params) {
    const queryItems = Object.keys(params)
        .map(key => `${encodeURIComponent(key)}=${encodeURIComponent(params[key])}`)
    return queryItems.join('&');
};

function displayResults(responseJson) {
    $('#results-list').empty();
    console.log(responseJson);
    if(responseJson.results.length === 0) {
        alert('No recipes found, please try again');
    } else {
        for (let i=0; i < responseJson.results.length; i++){
            $('#results-list').append(
                `<li cursor="pointer" onclick="getRecipeId(${responseJson.results[i].id})"><h3>${responseJson.results[i].title}</h3>
                <img src='https://spoonacular.com/recipeImages/${responseJson.results[i].imageUrls[0]}'>
                </li>`
            )
        };
    };
$('#searchResults').removeClass('hidden');
};

function displayRecipe(responseJson) {
    $('#results-list').empty();
    $('#js-error-message').empty();
    $('#recipe').removeClass('hidden');
    console.log(responseJson);
    $('#recipeCard').append(`<h2>${responseJson.title}</h2><h3>Ingredients:</h3>`);
    for (let i=0; i < responseJson.extendedIngredients.length; i++){
        $('#recipeCard').append(
        `<li id="${responseJson.extendedIngredients[i].id}">${responseJson.extendedIngredients[i].original}</li>`
        )
    };
    $('#recipeCard').append(`<h3>Instructions:</h3>`)
    for (let i=0; i < responseJson.analyzedInstructions[0].steps.length; i++){
        $('#recipeCard').append(
            `<li>${i+1}. ${responseJson.analyzedInstructions[0].steps[i].step}</li>`
        )
    };
    
};

function getRecipes(search, exclude, allergy){
    $('#js-error-message').empty();
    $('#recipeCard').empty();
    const params = {
        query: search,
        excludeIngredients: exclude,
        intolerances: allergy,
        offset: 0,
        number: 100,
        instructionsRequire: true
    };
    const queryString = formatQueryParams(params)
    const url = searchURL + 'search'+'?' + queryString;

    console.log(url);
    
    const request = new Request(url, {
        headers: new Headers({
            'X-RapidAPI-Key': ApiKey,
            'X-RapidAPI-Host': 'spoonacular-recipe-food-nutrition-v1.p.rapidapi.com'
        })
    });

    fetch(request)
        .then(response => {
            if(response.ok) {
                return response.json();
            }
            throw new Error(response.statusText);
        })
        .then(responseJson => displayResults(responseJson))
        .catch(err => {
            $('#js-error-message').text(`Something went wrong: ${err.message}`);
        });
};

function loadSelectedRecipe(recipeId) {
    const params = {
        id: recipeId
    };
    const recipe = formatQueryParams(params);
    const url = searchURL + recipeId + "/information";

    const request = new Request(url, {
        headers: new Headers({
            'X-RapidAPI-Key': ApiKey,
            'X-RapidAPI-Host': 'spoonacular-recipe-food-nutrition-v1.p.rapidapi.com'
        })
    })

    fetch(request)
        .then(response  => {
            if(response.ok) {
                return response.json();
            }
            throw new Error(response.statusText);
        })
        .then(responseJson => displayRecipe(responseJson))
        .catch(err => {
            $('#js-error-message').text(`Something went wrong: ${err.message}`);
        });
};

function getRecipeId(recipeId) {
    console.log(recipeId);
    loadSelectedRecipe(recipeId);
};

function watchForm() {
    $('form').submit(event => {
        event.preventDefault();
        const searchTerm = $('#js-search-term').val();
        const exclude = $('#js-search-intolerance').val();
        const allergy = $('#js-search-allergy').val();
        getRecipes(searchTerm, exclude, allergy);
    })
};
$(watchForm);