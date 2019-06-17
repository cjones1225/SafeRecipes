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
    const searchTerm = $('#js-search-term').val();
    const exclude = $('#js-search-exclude').val();
    const allergy = getCheckedIntolerances();
    $('#js-error-message').removeClass('hidden');
    $('#js-error-message').text(`Search Results for ${searchTerm}, Excluding: ${exclude}, ${allergy}`)
    if(responseJson.results.length === 0) {
        $('#results-list').append(
            `<h3>We're Sorry, but no recipes could be found matching your requests. Try excluding some Intolerances and then adjusting the Ingredients to suit your needs!</h3>`
        )
    } else {
        for (let i=0; i < responseJson.results.length; i++){
            $('#results-list').append(
                `<li cursor="pointer" onclick="getRecipeId(${responseJson.results[i].id})"><section><h2>${responseJson.results[i].title}</h2>
                <img alt="Picture of ${responseJson.results[i].title}" src='https://spoonacular.com/recipeImages/${responseJson.results[i].imageUrls[0]}'>
                <br><button onclick="loadSelectedRecipe()">Get Recipe!</button></section></li>`
            )
        };
    };
$('#searchResults').removeClass('hidden');
};

function displayRecipe(responseJson) {
    $('#results-list').empty();
    $('#recipe').removeClass('hidden');
    $('#recipeCard').append(`<li><img alt="Picture of ${responseJson.title}" src="${responseJson.image}"/></li><li><h2>${responseJson.title}</h2></li><li><h3>Ingredients:</h3></li>`);
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
            $('#js-error-message').text(`We're Sorry, Something went wrong: ${err.message}`);
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
            $('#js-error-message').text(`We're sorry, something went wrong: Cannot find instructions for this recipe.`);
        });
};

function getRecipeId(recipeId) {
    loadSelectedRecipe(recipeId);
};

var expanded = false;

function showCheckboxes() {
    let checkboxes = document.getElementById("checkboxes");
    if (!expanded) {
        checkboxes.style.display = "block";
        expanded = true;
    } else {
        checkboxes.style.display = "none";
        expanded = false;
    }
}

function getCheckedIntolerances() {
    let checked = new Array ();

    $('input[type=checkbox]:checked').each(function (){
        checked.push(this.id);
    });
    return checked;
};

function watchForm() {
    $('form').submit(event => {
        event.preventDefault();
        const searchTerm = $('#js-search-term').val();
        const exclude = $('#js-search-exclude').val();
        const allergy = getCheckedIntolerances();
        getRecipes(searchTerm, exclude, allergy);
    })
};
$(watchForm);