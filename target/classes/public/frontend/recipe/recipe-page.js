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
    const isAdmin = sessionStorage.getItem("is-admin");

    if (!token) {
        window.location.href = "login-page.html";
        return;
    }

    // Show/hide logout/admin links
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

            if (res.status === 401) {
                alert("Session expired. Please log in again.");
                sessionStorage.clear();
                window.location.href = "login-page.html";
                return;
            }

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
        const filtered = recipes.filter(r => r.name.toLowerCase().includes(term));
        refreshRecipeList(filtered);
    }

    async function addRecipe() {
        const name = addName?.value.trim();
        const instructions = addInstructions?.value.trim();
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

    async function updateRecipe() {
        const name = updateName?.value.trim();
        const instructions = updateInstructions?.value.trim();
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

    async function deleteRecipe() {
        const name = deleteName?.value.trim();
        if (!name) return alert("Enter recipe name");

        if (isAdmin !== "true") {
            alert("Only admin can delete recipes");
            return;
        }

        const recipe = recipes.find(r => r.name === name);
        if (!recipe) return alert("Recipe not found");

        try {
            const res = await fetch(`${BASE_URL}/recipes/${recipe.id}`, {
                method: "DELETE",
                headers: { "Authorization": `Bearer ${token}` }
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

    async function processLogout() {
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
