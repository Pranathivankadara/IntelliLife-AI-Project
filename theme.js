function applySavedTheme() {

    const theme = localStorage.getItem("intellilifeTheme");

    if (theme === "Dark") {
        document.body.classList.add("dark-mode");
    } else {
        document.body.classList.remove("dark-mode");
    }
}

applySavedTheme();