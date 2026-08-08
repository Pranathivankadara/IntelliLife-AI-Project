function openLogin() {
    document.getElementById("loginModal").style.display = "flex";
}

function closeLogin() {
    document.getElementById("loginModal").style.display = "none";
}

function login(event) {
    event.preventDefault();

    alert("Login Successful 🚀");

    window.location.href = "dashboard.html";
}

function scrollToFeatures() {
    document.getElementById("features").scrollIntoView({
        behavior: "smooth"
    });
}

/* Close modal when clicking outside */
window.onclick = function(event) {
    let modal = document.getElementById("loginModal");
    if (event.target === modal) {
        modal.style.display = "none";
    }
};
function go(page) {
    window.location.href = page;
}