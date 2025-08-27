/**
 * This script handles the login functionality for the Recipe Management Application.
 * It manages user authentication by sending login requests to the server and handling responses.
*/
const BASE_URL = "http://localhost:8081"; // backend URL

/* 
 * TODO: Get references to DOM elements
 * - username input
 * - password input
 * - login button
 * - logout button (optional, for token testing)
 */
const usernameInput = document.getElementById("login-input");
const passwordInput = document.getElementById("password-input");
const loginButton = document.getElementById("login-button");
const logoutButton = document.getElementById("logout-button");

/* 
 * TODO: Add click event listener to login button
 * - Call processLogin on click
 */
loginButton.addEventListener("click", processLogin);

/**
 * TODO: Process Login Function
 * 
 * Requirements:
 * - Retrieve values from username and password input fields
 * - Construct a request body with { username, password }
 * - Configure request options for fetch (POST, JSON headers)
 * - Send request to /login endpoint
 * - Handle responses:
 *    - If 200: extract token and isAdmin from response text
 *      - Store both in sessionStorage
 *      - Redirect to recipe-page.html
 *    - If 401: alert user about incorrect login
 *    - For others: show generic alert
 * - Add try/catch to handle fetch/network errors
 * 
 * Hints:
 * - Use fetch with POST method and JSON body
 * - Use sessionStorage.setItem("key", value) to store auth token and admin flag
 * - Use `window.location.href` for redirection
 */
async function processLogin() {
    const username = usernameInput.value.trim();
    const password = passwordInput.value;

    if (!username || !password) {
        alert("Please enter both username and password");
        return;
    }

    const requestBody = { username, password };

    const requestOptions = {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(requestBody)
    };

    try {
        const response = await fetch(`${BASE_URL}/login`, requestOptions);

        if (response.status === 200) {
            // ✅ Parse JSON instead of text
            const data = await response.json();

            // ✅ Store auth token
            if (data["auth-token"]) {
                sessionStorage.setItem("auth-token", data["auth-token"]);
            }

            // Optional admin flag
            if (data["is-admin"]) {
                sessionStorage.setItem("is-admin", data["is-admin"]);
            }

            // Show logout button (optional)
            if (logoutButton) {
                logoutButton.style.display = "inline";
            }

            // ✅ Redirect after short delay
            setTimeout(() => {
                window.location.href = "recipe-page.html";
            }, 500);

        } else if (response.status === 401) {
            alert("Incorrect login!");
        } else {
            alert("Unknown issue!");
        }
    } catch (error) {
        console.error("Login error:", error);
        alert("Network error during login");
    }
}

