/**
 * This script defines the add, view, and delete operations for Ingredient objects in the Recipe Management Application.
 */

const BASE_URL = "http://localhost:8081"; // backend URL

/* 
 * TODO: Get references to various DOM elements
 * - addIngredientNameInput
 * - deleteIngredientNameInput
 * - ingredientListContainer
 * - searchInput (optional for future use)
 * - adminLink (if visible conditionally)
 */
const addIngredientNameInput = document.getElementById("add-ingredient-name-input");
const deleteIngredientNameInput = document.getElementById("delete-ingredient-name-input");
const ingredientListContainer = document.getElementById("ingredient-list");
const addButton = document.getElementById("add-ingredient-submit-button");
const deleteButton = document.getElementById("delete-ingredient-submit-button");


/* 
 * TODO: Attach 'onclick' events to:
 * - "add-ingredient-submit-button" → addIngredient()
 * - "delete-ingredient-submit-button" → deleteIngredient()
 */
if (addButton) addButton.addEventListener("click", addIngredient);
if (deleteButton) deleteButton.addEventListener("click", deleteIngredient);

/*
 * TODO: Create an array to keep track of ingredients
 */
let ingredients = [];

/* 
 * TODO: On page load, call getIngredients()
 */
document.addEventListener("DOMContentLoaded", getIngredients);

/**
 * TODO: Add Ingredient Function
 * 
 * Requirements:
 * - Read and trim value from addIngredientNameInput
 * - Validate input is not empty
 * - Send POST request to /ingredients
 * - Include Authorization token from sessionStorage
 * - On success: clear input, call getIngredients() and refreshIngredientList()
 * - On failure: alert the user
 */
async function addIngredient() {
    const name = addIngredientNameInput.value.trim();
    if (!name) {
        alert("Please enter an ingredient name.");
        return;
    }

    try {
        const response = await fetch(`${BASE_URL}/ingredients`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${sessionStorage.getItem("auth-token")}`
            },
            body: JSON.stringify({ name })
        });

        if (response.ok) {
            addIngredientNameInput.value = "";
            await getIngredients();
        } else {
            alert("Failed to add ingredient.");
        }
    } catch (err) {
        console.error("Error adding ingredient:", err);
        alert("Network error while adding ingredient.");
    }
}


/**
 * TODO: Get Ingredients Function
 * 
 * Requirements:
 * - Fetch all ingredients from backend
 * - Store result in `ingredients` array
 * - Call refreshIngredientList() to display them
 * - On error: alert the user
 */
async function getIngredients() {
    try {
        const response = await fetch(`${BASE_URL}/ingredients`, {
            headers: {
                "Authorization": `Bearer ${sessionStorage.getItem("auth-token")}`
            }
        });

        if (response.ok) {
            ingredients = await response.json();
            refreshIngredientList();
        } else {
            alert("Failed to load ingredients.");
        }
    } catch (err) {
        console.error("Error fetching ingredients:", err);
        alert("Network error while loading ingredients.");
    }
}


/**
 * TODO: Delete Ingredient Function
 * 
 * Requirements:
 * - Read and trim value from deleteIngredientNameInput
 * - Search ingredientListContainer's <li> elements for matching name
 * - Determine ID based on index (or other backend logic)
 * - Send DELETE request to /ingredients/{id}
 * - On success: call getIngredients() and refreshIngredientList(), clear input
 * - On failure or not found: alert the user
 */
async function deleteIngredient() {
    const name = deleteIngredientNameInput.value.trim();
    if (!name) {
        alert("Please enter the ingredient name to delete.");
        return;
    }

    // Find ingredient by name
    const ingredient = ingredients.find(i => i.name.toLowerCase() === name.toLowerCase());
    if (!ingredient) {
        alert("Ingredient not found.");
        return;
    }

    try {
        const response = await fetch(`${BASE_URL}/ingredients/${ingredient.id}`, {
            method: "DELETE",
            headers: {
                "Authorization": `Bearer ${sessionStorage.getItem("auth-token")}`
            }
        });

        if (response.ok) {
            deleteIngredientNameInput.value = "";
            await getIngredients();
        } else {
            alert("Failed to delete ingredient.");
        }
    } catch (err) {
        console.error("Error deleting ingredient:", err);
        alert("Network error while deleting ingredient.");
    }
}


/**
 * TODO: Refresh Ingredient List Function
 * 
 * Requirements:
 * - Clear ingredientListContainer
 * - Loop through `ingredients` array
 * - For each ingredient:
 *   - Create <li> and inner <p> with ingredient name
 *   - Append to container
 */
function refreshIngredientList() {
    ingredientListContainer.innerHTML = "";

    ingredients.forEach(ingredient => {
        const li = document.createElement("li");
        li.textContent = ingredient.name;
        ingredientListContainer.appendChild(li);
    });
}