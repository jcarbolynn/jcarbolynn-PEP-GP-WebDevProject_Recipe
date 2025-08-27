const BASE_URL = "http://localhost:8081";
let recipes = [];

window.addEventListener("DOMContentLoaded", () => {
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

    // Show/hide logout/admin links safely
    if (logoutButton) logoutButton.style.display = token ? "inline" : "none";
    if (adminLink) adminLink.style.display = isAdmin === "true" ? "inline" : "none";

    if (logoutButton) logoutButton.addEventListener("click", processLogout);
    if (searchButton) searchButton.addEventListener("click", searchRecipes);
    if (addButton) addButton.addEventListener("click", addRecipe);
    if (updateButton) updateButton.addEventListener("click", updateRecipe);
    if (deleteButton) deleteButton.addEventListener("click", deleteRecipe);

    getRecipes();

    async function getRecipes() {
        try {
            const res = await fetch(`${BASE_URL}/recipes`);
            recipes = await res.json();
            refreshRecipeList(recipes);
        } catch (err) {
            console.error(err);
            alert("Failed to fetch recipes");
        }
    }

    function refreshRecipeList(list) {
        if (!recipeList) return;
        recipeList.innerHTML = "";
        (list || []).forEach(r => {
            const li = document.createElement("li");
            li.textContent = `${r.name}: ${r.instructions}`;
            recipeList.appendChild(li);
        });
    }

    async function searchRecipes() {
        const term = searchInput?.value.trim().toLowerCase() || "";
        if (!term) return refreshRecipeList(recipes);
        const filtered = recipes.filter(r => r.name.toLower
