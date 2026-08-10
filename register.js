const API_URL = "http://localhost:5000/api/auth";

const registerForm = document.getElementById("registerForm");

registerForm.addEventListener("submit", async function (event) {

    event.preventDefault();

    const name = document.getElementById("name").value.trim();
    const email = document.getElementById("email").value.trim();
    const password = document.getElementById("password").value.trim();
    const confirmPassword =
        document.getElementById("confirmPassword").value.trim();

    const message = document.getElementById("registerMessage");

    // Check passwords
    if (password !== confirmPassword) {
        message.style.color = "red";
        message.innerText = "Passwords do not match.";
        return;
    }

    try {

        const response = await fetch(`${API_URL}/register`, {
            method: "POST",

            headers: {
                "Content-Type": "application/json"
            },

            body: JSON.stringify({
                name,
                email,
                password
            })
        });

        const data = await response.json();

        if (response.ok) {

            // Save JWT token
            localStorage.setItem("token", data.token);

            // Save user details
            localStorage.setItem(
                "user",
                JSON.stringify(data.user)
            );

            message.style.color = "green";
            message.innerText =
                "Account created successfully!";

            // Go directly to dashboard
            setTimeout(() => {
                window.location.href = "dashboard.html";
            }, 700);

        } else {

            message.style.color = "red";

            message.innerText =
                data.message || "Registration failed.";

        }

    } catch (error) {

        console.error(error);

        message.style.color = "red";

        message.innerText =
            "Server not running!";
    }

});