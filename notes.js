/* =========================================
   INTELLILIFE AI - NOTES
========================================= */


/* =========================================
   NOTES DATA
========================================= */

let notes = JSON.parse(
    localStorage.getItem("intelliLifeNotes")
) || [

    {
        id: 1,
        title: "Machine Learning Important Notes",
        category: "Study",
        content:
            "Important concepts of Machine Learning including supervised learning, unsupervised learning, regression and classification.",
        date: "27 May 2026"
    },

    {
        id: 2,
        title: "NLP Important Questions",
        category: "Study",
        content:
            "Important questions related to tokenization, POS tagging, NER, stemming and text preprocessing.",
        date: "26 May 2026"
    },

    {
        id: 3,
        title: "IntelliLife AI Project Ideas",
        category: "Project",
        content:
            "Ideas and improvements for the IntelliLife AI project including AI assistant and Smart Campus features.",
        date: "25 May 2026"
    },

    {
        id: 4,
        title: "Future AI Ideas",
        category: "Ideas",
        content:
            "Some innovative ideas for future AI, machine learning and web development projects.",
        date: "24 May 2026"
    }

];


let editingNoteId = null;


/* =========================================
   SAVE NOTES
========================================= */

function saveToStorage() {

    localStorage.setItem(
        "intelliLifeNotes",
        JSON.stringify(notes)
    );

}


/* =========================================
   GET ICON
========================================= */

function getNoteIcon(category) {

    if (category === "Study") {
        return "📚";
    }

    if (category === "Project") {
        return "💡";
    }

    if (category === "Ideas") {
        return "✨";
    }

    return "📝";
}


/* =========================================
   DISPLAY NOTES
========================================= */

function renderNotes() {

    const container =
        document.getElementById("notesContainer");

    const searchText =
        document
            .getElementById("searchInput")
            .value
            .toLowerCase()
            .trim();

    const selectedCategory =
        document.getElementById("categoryFilter").value;


    let filteredNotes = notes.filter(note => {

        const matchesSearch =

            note.title
                .toLowerCase()
                .includes(searchText)

            ||

            note.content
                .toLowerCase()
                .includes(searchText)

            ||

            note.category
                .toLowerCase()
                .includes(searchText);


        const matchesCategory =

            selectedCategory === "All"

            ||

            note.category === selectedCategory;


        return matchesSearch && matchesCategory;

    });


    container.innerHTML = "";


    /* EMPTY */

    if (filteredNotes.length === 0) {

        container.innerHTML = `

            <div class="notes-empty">

                <div class="notes-empty-icon">
                    ▤
                </div>

                <h3>
                    No notes found
                </h3>

                <p>
                    Try a different search or create a new note.
                </p>

            </div>

        `;

    }


    /* NOTES */

    filteredNotes.forEach(note => {

        const icon =
            getNoteIcon(note.category);


        container.innerHTML += `

            <article class="note-item">

                <div class="note-item-header">

                    <div class="note-title-area">

                        <div class="note-icon">
                            ${icon}
                        </div>

                        <div>

                            <h3>
                                ${escapeHTML(note.title)}
                            </h3>

                            <div class="note-date">
                                ${note.date}
                            </div>

                        </div>

                    </div>


                    <span class="note-category">
                        ${note.category}
                    </span>

                </div>


                <p class="note-text">
                    ${escapeHTML(note.content)}
                </p>


                <div class="note-footer">

                    <small>
                        IntelliLife Notes
                    </small>


                    <div class="note-actions">

                        <button
                            class="edit-note"
                            onclick="editNote(${note.id})">

                            Edit

                        </button>


                        <button
                            class="delete-note"
                            onclick="deleteNote(${note.id})">

                            Delete

                        </button>

                    </div>

                </div>

            </article>

        `;

    });


    document.getElementById("notesCount")
        .innerText =
        filteredNotes.length +
        (filteredNotes.length === 1
            ? " Note"
            : " Notes");


    updateSummary();

}


/* =========================================
   UPDATE SUMMARY
========================================= */

function updateSummary() {

    document.getElementById("totalNotes")
        .innerText = notes.length;


    document.getElementById("studyNotes")
        .innerText =
        notes.filter(
            note => note.category === "Study"
        ).length;


    document.getElementById("projectNotes")
        .innerText =
        notes.filter(
            note => note.category === "Project"
        ).length;


    document.getElementById("ideaNotes")
        .innerText =
        notes.filter(
            note => note.category === "Ideas"
        ).length;

}


/* =========================================
   OPEN ADD MODAL
========================================= */

function openNoteModal() {

    editingNoteId = null;


    document.getElementById("modalTitle")
        .innerText = "Add Note";


    document.getElementById("noteTitle")
        .value = "";


    document.getElementById("noteCategory")
        .value = "Study";


    document.getElementById("noteContent")
        .value = "";


    document.getElementById("noteModal")
        .classList.add("show");

}


/* =========================================
   CLOSE MODAL
========================================= */

function closeNoteModal() {

    document.getElementById("noteModal")
        .classList.remove("show");

}


/* =========================================
   SAVE / EDIT NOTE
========================================= */

document.getElementById("noteForm")
    .addEventListener("submit", function(event) {

        event.preventDefault();


        const title =
            document
                .getElementById("noteTitle")
                .value
                .trim();


        const category =
            document
                .getElementById("noteCategory")
                .value;


        const content =
            document
                .getElementById("noteContent")
                .value
                .trim();


        if (!title || !content) {

            alert(
                "Please enter both title and content."
            );

            return;

        }


        /* EDIT */

        if (editingNoteId !== null) {

            const note =
                notes.find(
                    item =>
                        item.id === editingNoteId
                );


            if (note) {

                note.title = title;

                note.category = category;

                note.content = content;

            }

        }


        /* NEW NOTE */

        else {

            const today =
                new Date().toLocaleDateString(
                    "en-GB",
                    {
                        day: "2-digit",
                        month: "short",
                        year: "numeric"
                    }
                );


            notes.unshift({

                id: Date.now(),

                title: title,

                category: category,

                content: content,

                date: today

            });

        }


        saveToStorage();

        closeNoteModal();

        renderNotes();

    });


/* =========================================
   EDIT NOTE
========================================= */

function editNote(id) {

    const note =
        notes.find(
            item => item.id === id
        );


    if (!note) {
        return;
    }


    editingNoteId = id;


    document.getElementById("modalTitle")
        .innerText = "Edit Note";


    document.getElementById("noteTitle")
        .value = note.title;


    document.getElementById("noteCategory")
        .value = note.category;


    document.getElementById("noteContent")
        .value = note.content;


    document.getElementById("noteModal")
        .classList.add("show");

}


/* =========================================
   DELETE NOTE
========================================= */

function deleteNote(id) {

    const confirmDelete =
        confirm(
            "Are you sure you want to delete this note?"
        );


    if (!confirmDelete) {
        return;
    }


    notes =
        notes.filter(
            note => note.id !== id
        );


    saveToStorage();

    renderNotes();

}


/* =========================================
   CLOSE MODAL OUTSIDE CLICK
========================================= */

document.getElementById("noteModal")
    .addEventListener("click", function(event) {

        if (event.target === this) {

            closeNoteModal();

        }

    });


/* =========================================
   LOGOUT
========================================= */

function logoutUser() {

    localStorage.removeItem("token");

    localStorage.removeItem("user");

    window.location.href = "login.html";

}


/* =========================================
   HTML ESCAPE
========================================= */

function escapeHTML(text) {

    const div =
        document.createElement("div");

    div.textContent = text;

    return div.innerHTML;

}


/* =========================================
   INITIAL LOAD
========================================= */

renderNotes();