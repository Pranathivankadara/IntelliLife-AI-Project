// ==========================================
// DASHBOARD.JS
// ==========================================

const token = localStorage.getItem("token");

// ==========================================
// PROTECT DASHBOARD
// ==========================================

if (!token) {
    window.location.href = "login.html";
}


// ==========================================
// SHOW USER NAME
// ==========================================

const savedUser = localStorage.getItem("user");

if (savedUser) {

    try {

        const user = JSON.parse(savedUser);

        const userName =
            document.getElementById("userName");

        if (userName) {
            userName.innerText =
                user.name ||
                user.username ||
                "User";
        }

    } catch (error) {
        console.error("User data error:", error);
    }
}


// ==========================================
// ADD TASK
// ==========================================

async function addTask() {

    const input =
        document.getElementById("taskInput");

    if (!input) return;

    const task = input.value.trim();

    if (task === "") {
        alert("Please enter a task");
        return;
    }

    const token =
        localStorage.getItem("token");

    if (!token) {
        alert("Please login first");
        return;
    }

    try {

        // Get existing tasks
        const existingResponse =
            await fetch(
                "http://localhost:5000/api/tasks",
                {
                    method: "GET",
                    headers: {
                        "Authorization":
                            "Bearer " + token
                    }
                }
            );

        const existingData =
            await existingResponse.json();

        const tasks =
            Array.isArray(existingData)
                ? existingData
                : existingData.tasks || [];


        // Duplicate check
        const duplicate =
            tasks.some(
                existingTask =>
                    existingTask.text
                        .trim()
                        .toLowerCase() ===
                    task.toLowerCase()
            );

        if (duplicate) {
            alert(
                "This task already exists! ⚠️"
            );
            return;
        }


        // Add task
        const response =
            await fetch(
                "http://localhost:5000/api/tasks",
                {
                    method: "POST",

                    headers: {
                        "Content-Type":
                            "application/json",

                        "Authorization":
                            "Bearer " + token
                    },

                    body: JSON.stringify({
                        text: task
                    })
                }
            );

        const data =
            await response.json();

        if (!response.ok) {
            alert(
                data.message ||
                "Failed to add task"
            );
            return;
        }

        alert(
            "Task added successfully! ✅"
        );

        input.value = "";

        loadTasks();

    } catch (error) {

        console.error(error);

        alert("Server error");

    }
}


// ==========================================
// LOAD TASKS
// ==========================================

async function loadTasks() {

    const token =
        localStorage.getItem("token");

    if (!token) {
        window.location.href =
            "login.html";
        return;
    }

    try {

        const response =
            await fetch(
                "http://localhost:5000/api/tasks",
                {
                    method: "GET",

                    headers: {
                        "Authorization":
                            "Bearer " + token
                    }
                }
            );

        const data =
            await response.json();

        if (!response.ok) {
            console.error(data);
            return;
        }

        const tasks =
            Array.isArray(data)
                ? data
                : data.tasks || [];


        // ==================================
        // TOTAL
        // ==================================

        const totalTasks =
            document.getElementById(
                "totalTasks"
            );

        if (totalTasks) {
            totalTasks.innerText =
                tasks.length;
        }


        // ==================================
        // COMPLETED
        // ==================================

        const completedTasks =
            document.getElementById(
                "completedTasks"
            );

        const completed =
            tasks.filter(
                task => task.done === true
            ).length;

        if (completedTasks) {
            completedTasks.innerText =
                completed;
        }


        // ==================================
        // PENDING
        // ==================================

        const pendingTasks =
            document.getElementById(
                "pendingTasks"
            );

        const pending =
            tasks.filter(
                task => task.done !== true
            ).length;

        if (pendingTasks) {
            pendingTasks.innerText =
                pending;
        }


        // ==================================
        // TASK LIST
        // ==================================

        const taskList =
            document.getElementById(
                "taskList"
            );

        if (taskList) {

            taskList.innerHTML = "";

            tasks.forEach(task => {

                const div =
                    document.createElement("div");

                div.innerHTML = `

                    <div
                        class="task-item"
                        data-task-text="${escapeAttribute(task.text)}"
                        data-task-status="${
                            task.done
                                ? "completed"
                                : "pending"
                        }"
                    >

                        <span class="task-text">

                            ${
                                task.done
                                    ? "✅"
                                    : "📝"
                            }

                            ${escapeHTML(task.text)}

                        </span>


                        <div class="task-buttons">

                            ${
                                task.done

                                ?

                                `
                                <button
                                    class="complete-btn"
                                    disabled
                                >
                                    ✓ Completed
                                </button>
                                `

                                :

                                `
                                <button
                                    class="complete-btn"
                                    onclick="completeTask('${task._id}')"
                                >
                                    ✓ Complete
                                </button>
                                `
                            }


                            <button
                                class="edit-btn"
                                onclick="editTask(
                                    '${task._id}',
                                    '${escapeAttribute(task.text)}'
                                )"
                            >
                                ✏️ Edit
                            </button>


                            <button
                                class="delete-btn"
                                onclick="deleteTask('${task._id}')"
                            >
                                🗑️ Delete
                            </button>

                        </div>

                    </div>

                `;

                taskList.appendChild(div);

            });


            // Apply current search
            handleTaskSearch();
        }

    } catch (error) {

        console.error(
            "Error loading tasks:",
            error
        );

    }
}


// ==========================================
// ESCAPE HTML
// ==========================================

function escapeHTML(text) {

    const div =
        document.createElement("div");

    div.textContent = text;

    return div.innerHTML;
}


// ==========================================
// ESCAPE ATTRIBUTE
// ==========================================

function escapeAttribute(text) {

    return String(text)
        .replace(/\\/g, "\\\\")
        .replace(/'/g, "\\'")
        .replace(/"/g, "&quot;")
        .replace(/\n/g, " ");

}


// ==========================================
// TASK LIST SHOW / HIDE
// ==========================================

function toggleTaskList() {

    const taskList =
        document.getElementById(
            "taskList"
        );

    const controls =
        document.getElementById(
            "taskControls"
        );


    if (!taskList) return;


    if (
        taskList.style.display ===
        "none" ||
        taskList.style.display === ""
    ) {

        taskList.style.display =
            "block";

        if (controls) {
            controls.style.display =
                "block";
        }

        loadTasks();

    } else {

        taskList.style.display =
            "none";

        if (controls) {
            controls.style.display =
                "none";
        }

    }
}


// ==========================================
// LIVE SEARCH
// ==========================================

function handleTaskSearch() {

    const searchInput =
        document.getElementById(
            "taskSearch"
        );

    const filterSelect =
        document.getElementById(
            "taskFilter"
        );

    const taskList =
        document.getElementById(
            "taskList"
        );


    if (!searchInput || !taskList) {
        return;
    }


    const searchText =
        searchInput.value
            .trim()
            .toLowerCase();


    const selectedFilter =
        filterSelect
            ? filterSelect.value
            : "all";


    const taskItems =
        taskList.querySelectorAll(
            ".task-item"
        );


    taskItems.forEach(taskItem => {

        const taskText =
            (
                taskItem
                    .getAttribute(
                        "data-task-text"
                    ) || ""
            ).toLowerCase();


        const taskStatus =
            taskItem.getAttribute(
                "data-task-status"
            );


        const searchMatch =
            taskText.includes(
                searchText
            );


        let filterMatch = true;


        if (
            selectedFilter ===
            "pending"
        ) {

            filterMatch =
                taskStatus ===
                "pending";

        }


        if (
            selectedFilter ===
            "completed"
        ) {

            filterMatch =
                taskStatus ===
                "completed";

        }


        if (
            searchMatch &&
            filterMatch
        ) {

            taskItem.style.display =
                "flex";

        } else {

            taskItem.style.display =
                "none";

        }

    });


    // Show suggestions
    showTaskSuggestions(
        searchText
    );
}


// ==========================================
// SEARCH SUGGESTIONS
// ==========================================

function showTaskSuggestions(
    searchText
) {

    const suggestionBox =
        document.getElementById(
            "taskSuggestions"
        );


    const taskList =
        document.getElementById(
            "taskList"
        );


    if (
        !suggestionBox ||
        !taskList
    ) {
        return;
    }


    suggestionBox.innerHTML = "";


    if (searchText === "") {

        suggestionBox.style.display =
            "none";

        return;
    }


    const taskItems =
        taskList.querySelectorAll(
            ".task-item"
        );


    const suggestions = [];


    taskItems.forEach(taskItem => {

        const taskText =
            taskItem.getAttribute(
                "data-task-text"
            );


        if (
            taskText &&
            taskText
                .toLowerCase()
                .includes(searchText)
        ) {

            if (
                !suggestions.includes(
                    taskText
                )
            ) {

                suggestions.push(
                    taskText
                );

            }

        }

    });


    if (
        suggestions.length === 0
    ) {

        suggestionBox.innerHTML = `

            <div class="no-suggestion">
                No matching tasks found
            </div>

        `;

        suggestionBox.style.display =
            "block";

        return;
    }


    suggestions
        .slice(0, 5)
        .forEach(task => {

            const item =
                document.createElement(
                    "div"
                );


            item.className =
                "task-suggestion";


            item.innerHTML = `

                <span>🔍</span>

                <span>
                    ${escapeHTML(task)}
                </span>

            `;


            item.onclick =
                function () {

                    selectTaskSuggestion(
                        task
                    );

                };


            suggestionBox.appendChild(
                item
            );

        });


    suggestionBox.style.display =
        "block";
}


// ==========================================
// SELECT SEARCH SUGGESTION
// ==========================================

function selectTaskSuggestion(
    task
) {

    const searchInput =
        document.getElementById(
            "taskSearch"
        );


    const suggestionBox =
        document.getElementById(
            "taskSuggestions"
        );


    if (searchInput) {

        searchInput.value =
            task;

    }


    if (suggestionBox) {

        suggestionBox.style.display =
            "none";

    }


    handleTaskSearch();
}


// ==========================================
// ENTER KEY SEARCH
// ==========================================

function handleSearchKey(event) {

    if (
        event.key ===
        "Enter"
    ) {

        filterTasks();

    }
}


// ==========================================
// SEARCH BUTTON
// ==========================================

function filterTasks() {

    handleTaskSearch();


    const suggestionBox =
        document.getElementById(
            "taskSuggestions"
        );

    if (suggestionBox) {

        suggestionBox.style.display =
            "none";

    }
}


// ==========================================
// CLOSE SUGGESTIONS
// ==========================================

document.addEventListener(
    "click",
    function(event) {

        const wrapper =
            document.querySelector(
                ".search-wrapper"
            );

        const suggestionBox =
            document.getElementById(
                "taskSuggestions"
            );


        if (
            wrapper &&
            suggestionBox &&
            !wrapper.contains(
                event.target
            )
        ) {

            suggestionBox.style.display =
                "none";

        }

    }
);


// ==========================================
// DELETE TASK
// ==========================================

async function deleteTask(id) {

    const token =
        localStorage.getItem("token");


    if (
        !confirm(
            "Are you sure you want to delete this task?"
        )
    ) {
        return;
    }


    try {

        const response =
            await fetch(
                `http://localhost:5000/api/tasks/${id}`,
                {
                    method: "DELETE",

                    headers: {
                        "Authorization":
                            "Bearer " + token
                    }
                }
            );


        const data =
            await response.json();


        if (!response.ok) {

            alert(
                data.message ||
                "Failed to delete task"
            );

            return;
        }


        alert(
            "Task deleted successfully! 🗑️"
        );


        loadTasks();

    } catch (error) {

        console.error(error);

        alert("Server error");

    }
}


// ==========================================
// EDIT TASK
// ==========================================

async function editTask(
    id,
    oldText
) {

    const newText =
        prompt(
            "Edit your task:",
            oldText
        );


    if (
        !newText ||
        newText.trim() === ""
    ) {
        return;
    }


    const token =
        localStorage.getItem("token");


    try {

        const response =
            await fetch(
                `http://localhost:5000/api/tasks/${id}`,
                {
                    method: "PUT",

                    headers: {
                        "Content-Type":
                            "application/json",

                        "Authorization":
                            "Bearer " + token
                    },

                    body: JSON.stringify({
                        text:
                            newText.trim()
                    })
                }
            );


        const data =
            await response.json();


        if (!response.ok) {

            alert(
                data.message ||
                "Failed to edit task"
            );

            return;
        }


        alert(
            "Task updated successfully! ✏️"
        );


        loadTasks();

    } catch (error) {

        console.error(error);

        alert("Server error");

    }
}


// ==========================================
// COMPLETE TASK
// ==========================================

async function completeTask(id) {

    const token =
        localStorage.getItem("token");


    try {

        const response =
            await fetch(
                `http://localhost:5000/api/tasks/${id}`,
                {
                    method: "PUT",

                    headers: {
                        "Content-Type":
                            "application/json",

                        "Authorization":
                            "Bearer " + token
                    },

                    body: JSON.stringify({
                        done: true
                    })
                }
            );


        const data =
            await response.json();


        if (!response.ok) {

            alert(
                data.message ||
                "Failed to complete task"
            );

            return;
        }


        alert(
            "Task completed! ✅"
        );


        loadTasks();

    } catch (error) {

        console.error(error);

        alert("Server error");

    }
}


// ==========================================
// AI ASSISTANT
// ==========================================

function sendMessage() {

    const input =
        document.getElementById(
            "userInput"
        );

    const chatBox =
        document.getElementById(
            "chatBox"
        );


    if (!input || !chatBox) {
        return;
    }


    const originalMessage =
        input.value.trim();


    const message =
        originalMessage.toLowerCase();


    if (message === "") {
        return;
    }


    chatBox.innerHTML += `

        <div class="user-message">

            <strong>You:</strong>

            ${escapeHTML(
                originalMessage
            )}

        </div>

    `;


    let reply =
        "Sorry, I don't understand that yet. Try asking me about the project, tasks, JWT, MongoDB, backend or technologies.";


    // BASIC

    if (
        message === "hi" ||
        message === "hello" ||
        message === "hey"
    ) {

        reply =
            "Hello! 👋 How can I help you?";

    }

    else if (
        message.includes("how are you")
    ) {

        reply =
            "I'm doing great! 😊 Ready to help you.";

    }

    else if (
        message.includes("who are you") ||
        message.includes("your name")
    ) {

        reply =
            "I'm your IntelliLife AI Assistant 🤖.";

    }

    else if (
        message.includes("what can you do")
    ) {

        reply =
            "I can help you with tasks and answer basic project-related questions.";

    }


    // PROJECT

    else if (
        message.includes("project name") ||
        message.includes("name of the project")
    ) {

        reply =
            "The project name is IntelliLife AI. 🚀";

    }

    else if (
        message.includes("what is this project") ||
        message.includes("what is intellilife")
    ) {

        reply =
            "IntelliLife AI is an intelligent personal and smart campus ecosystem designed to help students manage tasks and access smart features.";

    }

    else if (
        message.includes("purpose")
    ) {

        reply =
            "The main purpose is to make student activities easier by combining smart task management, AI assistance and campus-related features.";

    }

    else if (
        message.includes("technology") ||
        message.includes("technologies") ||
        message.includes("tech stack")
    ) {

        reply =
            "Our project uses HTML, CSS, JavaScript, Node.js, Express.js, MongoDB and AI technologies.";

    }


    // TECHNICAL

    else if (
        message.includes("jwt")
    ) {

        reply =
            "JWT stands for JSON Web Token. We use it for secure authentication between the frontend and backend.";

    }

    else if (
        message.includes("mongodb")
    ) {

        reply =
            "MongoDB is our database. It stores user and task information.";

    }

    else if (
        message.includes("backend")
    ) {

        reply =
            "Our backend is built using Node.js and Express.js. It handles APIs, authentication and database communication.";

    }

    else if (
        message.includes("node")
    ) {

        reply =
            "Node.js allows us to run JavaScript on the server side and build our backend.";

    }

    else if (
        message.includes("express")
    ) {

        reply =
            "Express.js is a Node.js framework that helps us create APIs and handle backend routes.";

    }


    // TASKS

    else if (
        message.includes("add task") ||
        message.includes("create task")
    ) {

        reply =
            "You can add a new task using the Add Task section. 📝";

    }

    else if (
        message.includes("show my tasks") ||
        message.includes("my tasks") ||
        message.includes("task list")
    ) {

        reply =
            "Click the Task List button to view your tasks. 📋";

    }

    else if (
        message.includes("complete task")
    ) {

        reply =
            "Click the ✓ Complete button beside a pending task to mark it as completed. ✅";

    }

    else if (
        message.includes("delete task")
    ) {

        reply =
            "Click the 🗑️ Delete button beside a task to remove it.";

    }

    else if (
        message.includes("edit task")
    ) {

        reply =
            "Click the ✏️ Edit button beside a task and enter the updated task name.";

    }


    // GOODBYE

    else if (
        message === "bye" ||
        message.includes("goodbye")
    ) {

        reply =
            "Goodbye! 👋 Have a great day!";

    }


    chatBox.innerHTML += `

        <div class="ai-message">

            <strong>AI:</strong>

            ${reply}

        </div>

    `;


    input.value = "";

    chatBox.scrollTop =
        chatBox.scrollHeight;
}


// ==========================================
// SIDEBAR NAVIGATION
// ==========================================

function go(page) {

    window.location.href =
        page;

}


// ==========================================
// LOGOUT
// ==========================================

function logout() {

    localStorage.removeItem("token");

    localStorage.removeItem("user");

    window.location.href =
        "login.html";
}


// ==========================================
// LOAD TASKS ON PAGE LOAD
// ==========================================

loadTasks();