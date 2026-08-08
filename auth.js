const API_URL = "http://localhost:5000/api/auth";

// Login User
async function loginUser() {
    const email = document.getElementById("email").value.trim();
    const password = document.getElementById("password").value.trim();
    const message = document.getElementById("message");

    if (!email || !password) {
        message.innerText = "Please enter email and password.";
        message.style.color = "red";
        return;
    }

    try {
        const response = await fetch(`${API_URL}/login`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                email,
                password
            })
        });

        const data = await response.json();

        if (response.ok) {
            localStorage.setItem("token", data.token);
            localStorage.setItem("user", JSON.stringify(data.user));

            message.style.color = "green";
            message.innerText = "Login Successful!";

            setTimeout(() => {
                window.location.href = "dashboard.html";
            }, 1000);
        } else {
            message.style.color = "red";
            message.innerText = data.message || "Login Failed!";
        }

    } catch (error) {
        console.error(error);
        message.style.color = "red";
        message.innerText = "Server not running!";
    }
}

// Check Login
function checkLogin() {
    const token = localStorage.getItem("token");

    if (!token) {
        window.location.href = "login.html";
    }
}

// Logout
function logout() {
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    window.location.href = "login.html";
}