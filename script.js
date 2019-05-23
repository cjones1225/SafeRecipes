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
    for (let i=0; i < responseJson.results.length; i++){
        $('#results-list').append(
            `<li><button onclick="getRecipeId(${responseJson.results[i].id})" id="${responseJson.results[i].id}">${responseJson.results[i].title}</button>
            <img src='https://spoonacular.com/recipeImages/${responseJson.results[i].imageUrls[0]}'>
            </li>`
        )
    };
    $('#results').removeClass('hidden');
};

function displayRecipe(responseJson) {
    $('#results-list').empty();
    console.log(responseJson);
    $('#results-list').append(
        `<h2>${responseJson.title}</h2>
        <h3>Ingredients:</h3>`
    );
    for (let i=0; i < responseJson.extendedIngredients.length; i++){
        $('#results-list').append(
        `<li>${responseJson.extendedIngredients[i].original}</li>`
        )
    };
    $('#results-list').append(`<h3>Instructions:</h3>`)
    for (let i=0; i < responseJson.analyzedInstructions[0].steps.length; i++){
        $('#results-list').append(
            `<li>${i+1}. ${responseJson.analyzedInstructions[0].steps[i].step}</li>`
        )
    };
    
};

function getRecipes(query){
    const params = {
        query: query
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

function loadRecipe(recipeId) {
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
    loadRecipe(recipeId);
};

function watchForm() {
    $('form').submit(event => {
        event.preventDefault();
        const searchTerm = $('#js-search-term').val();
        getRecipes(searchTerm);
    });
    // $('button').click(event => {
    //     event.preventDefault();
    //     loadRecipe();
    // });
};
$(watchForm);