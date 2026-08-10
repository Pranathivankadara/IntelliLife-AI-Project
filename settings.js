/* =========================================
   INTELLILIFE AI - SETTINGS
========================================= */


/* =========================================
   CHANGE SETTINGS SECTION
========================================= */

function showSection(sectionId, clickedButton) {

    const sections = document.querySelectorAll(".settings-section");

    sections.forEach(section => {
        section.classList.remove("active-section");
    });

    const buttons = document.querySelectorAll(".menu-item");

    buttons.forEach(button => {
        button.classList.remove("active");
    });

    const selectedSection = document.getElementById(sectionId);

    if (selectedSection) {
        selectedSection.classList.add("active-section");
    }

    if (clickedButton) {
        clickedButton.classList.add("active");
    }
}


/* =========================================
   PROFILE
========================================= */

function saveProfile() {

    const profile = {
        name: document.getElementById("name").value,
        email: document.getElementById("email").value,
        phone: document.getElementById("phone").value,
        occupation: document.getElementById("occupation").value
    };

    localStorage.setItem(
        "intellilifeProfile",
        JSON.stringify(profile)
    );

    alert("Profile updated successfully!");
}


function loadProfile() {

    const savedProfile =
        localStorage.getItem("intellilifeProfile");

    if (!savedProfile) {
        return;
    }

    const profile = JSON.parse(savedProfile);

    if (profile.name) {
        document.getElementById("name").value = profile.name;
    }

    if (profile.email) {
        document.getElementById("email").value = profile.email;
    }

    if (profile.phone) {
        document.getElementById("phone").value = profile.phone;
    }

    if (profile.occupation) {
        document.getElementById("occupation").value =
            profile.occupation;
    }
}


/* =========================================
   CHANGE PHOTO
========================================= */

function changePhoto() {

    alert("Profile photo upload will be available soon.");
}


/* =========================================
   NOTIFICATIONS
========================================= */

function saveNotifications() {

    const switches =
        document.querySelectorAll(".setting-row input");

    const notifications = [];

    switches.forEach((item, index) => {

        notifications.push({
            id: index,
            enabled: item.checked
        });

    });

    localStorage.setItem(
        "intellilifeNotifications",
        JSON.stringify(notifications)
    );

    alert("Notification settings saved!");
}


function loadNotifications() {

    const saved =
        localStorage.getItem("intellilifeNotifications");

    if (!saved) {
        return;
    }

    const notifications = JSON.parse(saved);

    const switches =
        document.querySelectorAll(".setting-row input");

    notifications.forEach((item, index) => {

        if (switches[index]) {
            switches[index].checked = item.enabled;
        }

    });
}


/* =========================================
   APPEARANCE
========================================= */

function selectTheme(card) {

    const cards = document.querySelectorAll(".theme-card");

    cards.forEach(item => {
        item.classList.remove("selected");
    });

    card.classList.add("selected");

    const themeName = card.querySelector("strong").innerText;

    // Save selected theme
    localStorage.setItem("intellilifeTheme", themeName);

    // Apply immediately
    if (themeName === "Dark") {
        document.body.classList.add("dark-mode");
    } else {
        document.body.classList.remove("dark-mode");
    }
}

function applyTheme(themeName) {

    if (themeName === "Dark") {

        document.body.classList.add("dark-mode");

    } else {

        document.body.classList.remove("dark-mode");
    }
}


function loadTheme() {

    const savedTheme =
        localStorage.getItem("intellilifeTheme");

    if (!savedTheme) {
        return;
    }

    const cards =
        document.querySelectorAll(".theme-card");

    cards.forEach(card => {

        const name =
            card.querySelector("strong").innerText;

        card.classList.remove("selected");

        if (name === savedTheme) {
            card.classList.add("selected");
        }
    });

    applyTheme(savedTheme);
}


/* =========================================
   SECURITY
========================================= */

function changePassword() {

    const newPassword =
        prompt("Enter your new password:");

    if (!newPassword) {
        return;
    }

    if (newPassword.length < 6) {

        alert("Password must contain at least 6 characters.");

        return;
    }

    localStorage.setItem(
        "intellilifePasswordChanged",
        "true"
    );

    alert("Password changed successfully!");
}


function viewSessions() {

    alert(
        "Active Sessions\n\n" +
        "Current Device\n" +
        "Chrome Browser\n" +
        "Active now"
    );
}


function deleteAccount() {

    const confirmation = confirm(
        "Are you sure you want to delete your account?"
    );

    if (confirmation) {

        localStorage.removeItem("intellilifeProfile");
        localStorage.removeItem("intellilifeNotifications");
        localStorage.removeItem("intellilifeTheme");

        alert("Account deletion request submitted.");
    }
}


/* =========================================
   PREFERENCES
========================================= */

function savePreferences() {

    const language =
        document.querySelectorAll(".preference-group select")[0].value;

    const currency =
        document.querySelectorAll(".preference-group select")[1].value;

    const startPage =
        document.querySelectorAll(".preference-group select")[2].value;

    const preferences = {
        language: language,
        currency: currency,
        startPage: startPage
    };

    localStorage.setItem(
        "intellilifePreferences",
        JSON.stringify(preferences)
    );

    alert("Preferences saved successfully!");
}


/* =========================================
   LOGOUT
========================================= */

function logout() {

    const confirmation = confirm(
        "Are you sure you want to logout?"
    );

    if (confirmation) {

        localStorage.removeItem("token");
        localStorage.removeItem("user");

        window.location.href = "login.html";
    }
}


/* =========================================
   PAGE LOAD
========================================= */

document.addEventListener(
    "DOMContentLoaded",
    function () {

        loadProfile();

        loadNotifications();

        loadTheme();

    }
);
document.addEventListener("DOMContentLoaded", function () {

    const savedTheme = localStorage.getItem("intellilifeTheme");

    if (savedTheme === "Dark") {
        document.body.classList.add("dark-mode");
    } else {
        document.body.classList.remove("dark-mode");
    }

    loadProfile();
    loadNotifications();
});