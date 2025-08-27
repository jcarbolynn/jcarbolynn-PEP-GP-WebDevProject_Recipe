/**
 * This script defines the CRUD operations for Recipe objects in the Recipe Management Application.
 */

const BASE_URL = "http://localhost:8081"; // backend URL

let recipes = [];

// Wait for DOM to fully load before accessing elements
window.addEventListener("DOMContentLoaded", () => {

    /* 
     * TODO: Get references to various DOM elements
     * - Recipe name and instructions fields (add, update, delete)
     * - Recipe list container
     * - Admin link and logout button
     * - Search input
    */
    const logoutButton = document.getElementById("logout-button");
    const adminLink = document.getElementById("admin-link");
    const recipeList = document.getElementById("recipe-list");

    const searchInput = document.getElementById("search-input");
    const searchButton = document.getElementById("search-button");

    const addName = document.getElementById("add-recipe-name-input");
    const addInstructions = document.getElementById("add-recipe-instructions-input");
    const addButton = document.getElementById("add-recipe-submit-input");

    const updateName = document.getElementById("update-recipe-name-input");
    const updateInstructions = document.getElementById("update-recipe-instructions-input");
    const updateButton = document.getElementById("update-recipe-submit-input");

    const deleteName = document.getElementById("delete-recipe-name-input");
    const deleteButton = document.getElementById("delete-recipe-submit-input");

    const token = sessionStorage.getItem("auth-token");
    const isAdmin = sessionStorage.getItem("isAdmin");

    /*
     * TODO: Show logout button if auth-token exists in sessionStorage
     */
    if (token) logoutButton.style.display = "inline";
    /*
     * TODO: Show admin link if is-admin flag in sessionStorage is "true"
     */
    if (isAdmin === "true") adminLink.style.display = "inline";
    /*
     * TODO: Attach event handlers
     * - Add recipe button → addRecipe()
     * - Update recipe button → updateRecipe()
     * - Delete recipe button → deleteRecipe()
     * - Search button → searchRecipes()
     * - Logout button → processLogout()
     */
    logoutButton.addEventListener("click", processLogout);
    searchButton.addEventListener("click", searchRecipes);
    addButton.addEventListener("click", addRecipe);
    updateButton.addEventListener("click", updateRecipe);
    deleteButton.addEventListener("click", deleteRecipe);
    /*
     * TODO: On page load, call getRecipes() to populate the list
     */
    getRecipes();

    /**
     * TODO: Search Recipes Function
     * - Read search term from input field
     * - Send GET request with name query param
     * - Update the recipe list using refreshRecipeList()
     * - Handle fetch errors and alert user
     */
    async function searchRecipes() {
        // Implement search logic here
        const term = searchInput.value.trim().toLowerCase();
        if (!term) return refreshRecipeList(recipes);
        const filtered = recipes.filter(r => r.name.toLowerCase().includes(term));
        refreshRecipeList(filtered);
    }

    /**
     * TODO: Add Recipe Function
     * - Get values from add form inputs
     * - Validate both name and instructions
     * - Send POST request to /recipes
     * - Use Bearer token from sessionStorage
     * - On success: clear inputs, fetch latest recipes, refresh the list
     */
    async function addRecipe() {
        // Implement add logic here
        const name = addName.value.trim();
        const instructions = addInstructions.value.trim();
        if (!name || !instructions) return alert("Name & instructions required");

        try {
            const res = await fetch(`${BASE_URL}/recipes`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                },
                body: JSON.stringify({ name, instructions })
            });
            if (res.ok) {
                addName.value = "";
                addInstructions.value = "";
                await getRecipes();
            } else {
                alert("Failed to add recipe");
            }
        } catch (err) {
            console.error(err);
            alert("Network error");
        }
    }

    /**
     * TODO: Update Recipe Function
     * - Get values from update form inputs
     * - Validate both name and updated instructions
     * - Fetch current recipes to locate the recipe by name
     * - Send PUT request to update it by ID
     * - On success: clear inputs, fetch latest recipes, refresh the list
     */
    async function updateRecipe() {
        // Implement update logic here
        const name = updateName.value.trim();
        const instructions = updateInstructions.value.trim();
        if (!name || !instructions) return alert("Name & instructions required");

        const recipe = recipes.find(r => r.name === name);
        if (!recipe) return alert("Recipe not found");

        try {
            const res = await fetch(`${BASE_URL}/recipes/${recipe.id}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                },
                // body: JSON.stringify({ name, instructions })  // send both!
                body: JSON.stringify({ instructions })
            });
            if (res.ok) {
                updateName.value = "";
                updateInstructions.value = "";
                await getRecipes();
            } else {
                alert("Failed to update recipe");
            }
        } catch (err) {
            console.error(err);
            alert("Network error");
        }
    }

    /**
     * TODO: Delete Recipe Function
     * - Get recipe name from delete input
     * - Find matching recipe in list to get its ID
     * - Send DELETE request using recipe ID
     * - On success: refresh the list
     */
    async function deleteRecipe() {
        // Implement delete logic here
        const name = deleteName.value.trim();
        if (!name) return alert("Enter recipe name");

        // Check admin privileges
        const isAdmin = sessionStorage.getItem("isAdmin");
        if (isAdmin !== "true") {
            alert("Only admin can delete recipes");
            return;
        }

        const recipe = recipes.find(r => r.name === name);
        if (!recipe) return alert("Recipe not found");

        try {
            const res = await fetch(`${BASE_URL}/recipes/${recipe.id}`, {
                method: "DELETE",
                headers: { "Authorization": `Bearer ${sessionStorage.getItem("auth-token")}` }
            });
            if (res.ok) {
                deleteName.value = "";
                await getRecipes();
            } else {
                alert("Failed to delete recipe");
            }
        } catch (err) {
            console.error(err);
            alert("Network error");
        }
    }

    /**
     * TODO: Get Recipes Function
     * - Fetch all recipes from backend
     * - Store in recipes array
     * - Call refreshRecipeList() to display
     */
    async function getRecipes() {
        // Implement get logic here
        try {
            const res = await fetch(`${BASE_URL}/recipes`);
            recipes = await res.json();
            refreshRecipeList(recipes);
        } catch (err) {
            console.error(err);
            alert("Failed to fetch recipes");
        }
    }

    /**
     * TODO: Refresh Recipe List Function
     * - Clear current list in DOM
     * - Create <li> elements for each recipe with name + instructions
     * - Append to list container
     */
    function refreshRecipeList() {
        // Implement refresh logic here
        recipeList.innerHTML = "";
        list.forEach(r => {
            const li = document.createElement("li");
            li.textContent = `${r.name}: ${r.instructions}`;
            recipeList.appendChild(li);
        });
    }

    /**
     * TODO: Logout Function
     * - Send POST request to /logout
     * - Use Bearer token from sessionStorage
     * - On success: clear sessionStorage and redirect to login
     * - On failure: alert the user
     */
    async function processLogout() {
        // Implement logout logic here
        try {
            const res = await fetch(`${BASE_URL}/logout`, {
                method: "POST",
                headers: { "Authorization": `Bearer ${token}` }
            });
            if (res.ok) {
                sessionStorage.clear();
                window.location.href = "login-page.html";
            } else {
                alert("Logout failed");
            }
        } catch (err) {
            console.error(err);
            alert("Network error during logout");
        }
    }

});
