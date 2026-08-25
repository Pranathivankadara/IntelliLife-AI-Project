// ==========================================
// DASHBOARD.JS
// ==========================================


// ==========================================
// AUTH TOKEN
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

        console.error(
            "User data error:",
            error
        );
    }
}


// ==========================================
// ADD TASK
// ==========================================

async function addTask() {

    const input =
        document.getElementById("taskInput");

    if (!input) return;

    const task =
        input.value.trim();

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

        /*
        ==========================================
        NOTE

        Dashboard Task Cards are now controlled
        by Planner data.

        Planner = Task Manager for Dashboard.

        MongoDB tasks are still loaded here for
        the Task Manager section itself.
        ==========================================
        */


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


        /*
        ==========================================
        IMPORTANT

        Do NOT use MongoDB task count here.

        Dashboard Tasks / Completed / Pending
        cards are based on Planner module.
        ==========================================
        */

        updateTaskCardsFromPlanner();


    } catch (error) {

        console.error(
            "Error loading tasks:",
            error
        );
    }
}


// ==========================================
// UPDATE TASK CARDS FROM PLANNER
// ==========================================

function updateTaskCardsFromPlanner() {

    const plannerData =
        JSON.parse(
            localStorage.getItem(
                "intelliLifePlanner"
            )
        ) || [];


    // ==========================================
    // TOTAL PLANNER TASKS
    // ==========================================

    const total =
        plannerData.length;


    // ==========================================
    // COMPLETED PLANNER TASKS
    // ==========================================

    const completed =
        plannerData.filter(
            task =>
                task.completed === true
        ).length;


    // ==========================================
    // PENDING PLANNER TASKS
    // ==========================================

    const pending =
        plannerData.filter(
            task =>
                task.completed !== true
        ).length;


    // ==========================================
    // TOTAL TASKS CARD
    // ==========================================

    const totalTasks =
        document.getElementById(
            "totalTasks"
        );

    if (totalTasks) {

        totalTasks.textContent =
            total;
    }


    // ==========================================
    // COMPLETED TASKS CARD
    // ==========================================

    const completedTasks =
        document.getElementById(
            "completedTasks"
        );

    if (completedTasks) {

        completedTasks.textContent =
            completed;
    }


    // ==========================================
    // PENDING TASKS CARD
    // ==========================================

    const pendingTasks =
        document.getElementById(
            "pendingTasks"
        );

    if (pendingTasks) {

        pendingTasks.textContent =
            pending;
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

        taskList.style.display ===
            ""
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

async function sendMessage() {

    const input =
        document.getElementById("userInput");

    const chatBox =
        document.getElementById("chatBox");

    if (!input || !chatBox) {
        return;
    }

    const originalMessage =
        input.value.trim();

    if (originalMessage === "") {
        return;
    }

    // ==========================================
    // SHOW USER MESSAGE
    // ==========================================

    chatBox.innerHTML += `
        <div class="user-message">
            <strong>You:</strong>
            ${escapeHTML(originalMessage)}
        </div>
    `;

    input.value = "";

    chatBox.scrollTop =
        chatBox.scrollHeight;


    // ==========================================
    // SHOW THINKING
    // ==========================================

    const thinkingId =
        "ai-thinking-" + Date.now();

    chatBox.innerHTML += `
        <div class="ai-message" id="${thinkingId}">
            <strong>AI:</strong>
            Thinking... 🤖
        </div>
    `;

    chatBox.scrollTop =
        chatBox.scrollHeight;


    try {

        // ==========================================
        // GET JWT TOKEN
        // ==========================================

        const token =
            localStorage.getItem("token");

        if (!token) {

            throw new Error(
                "Authentication token not found. Please login again."
            );
        }


        // ==========================================
        // SEND TO BACKEND AI
        // ==========================================

        const response =
            await fetch(
                "http://localhost:5000/api/ai/chat",
                {
                    method: "POST",

                    headers: {
                        "Content-Type":
                            "application/json",

                        "Authorization":
                            "Bearer " + token
                    },

                    body: JSON.stringify({
                        message:
                            originalMessage
                    })
                }
            );


        // ==========================================
        // GET BACKEND RESPONSE
        // ==========================================

        const data =
            await response.json();


        // ==========================================
        // REMOVE THINKING
        // ==========================================

        const thinkingMessage =
            document.getElementById(
                thinkingId
            );

        if (thinkingMessage) {
            thinkingMessage.remove();
        }


        // ==========================================
        // HANDLE BACKEND ERROR
        // ==========================================

        if (!response.ok || !data.success) {

            throw new Error(
                data.message ||
                "AI request failed."
            );
        }


        // ==========================================
        // DISPLAY AI RESPONSE
        // ==========================================

        const reply =
            data.reply ||
            "I couldn't generate a response.";


        chatBox.innerHTML += `
            <div class="ai-message">

                <strong>AI:</strong>

                <div>
                    ${formatAIResponse(reply)}
                </div>

            </div>
        `;


        chatBox.scrollTop =
            chatBox.scrollHeight;


        // ==========================================
        // OPTIONAL DEBUG
        // ==========================================

        console.log(
            "AI Intent:",
            data.intent
        );

        console.log(
            "AI Reply:",
            data.reply
        );


    } catch (error) {

        console.error(
            "AI Request Error:",
            error
        );


        // Remove thinking message

        const thinkingMessage =
            document.getElementById(
                thinkingId
            );

        if (thinkingMessage) {
            thinkingMessage.remove();
        }


        // Display error

        chatBox.innerHTML += `
            <div class="ai-message">

                <strong>AI:</strong>

                Sorry, I couldn't connect to the AI service. ❌

                <br>

                <small>
                    ${escapeHTML(error.message)}
                </small>

            </div>
        `;


        chatBox.scrollTop =
            chatBox.scrollHeight;
    }
}


// ==========================================
// FORMAT AI RESPONSE
// ==========================================

function formatAIResponse(text) {

    return escapeHTML(text)
        .replace(/\n/g, "<br>");
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

    localStorage.removeItem(
        "token"
    );


    localStorage.removeItem(
        "user"
    );


    window.location.href =
        "login.html";
}


// ==========================================
// GOAL PROGRESS
// ==========================================

function updateGoalProgress() {

    const goals =
        JSON.parse(
            localStorage.getItem(
                "intelliLifeGoals"
            )
        ) || [];


    let totalSubtasks = 0;

    let completedSubtasks = 0;


    goals.forEach(goal => {

        if (!goal.subtasks) return;


        goal.subtasks.forEach(
            subtask => {

                totalSubtasks++;


                if (
                    subtask.completed
                ) {

                    completedSubtasks++;
                }

            }
        );

    });


    const progress =
        totalSubtasks === 0

            ? 0

            : Math.round(
                (
                    completedSubtasks /
                    totalSubtasks
                ) * 100
            );


    const goalProgress =
        document.getElementById(
            "goalProgress"
        );


    if (goalProgress) {

        goalProgress.textContent =
            progress + "%";
    }
}


// ==========================================
// TODAY'S FOCUS
// ==========================================

function updateTodayFocus() {

    const plannerData =
        JSON.parse(
            localStorage.getItem(
                "intelliLifePlanner"
            )
        ) || [];


    const todayFocus =
        document.getElementById(
            "todayFocus"
        );


    if (!todayFocus) return;


    const today =
        new Date()
            .toISOString()
            .split("T")[0];


    const todayTasks =
        plannerData.filter(task => {

            return (
                task.date === today &&
                task.completed !== true
            );

        });


    if (
        todayTasks.length === 0
    ) {

        todayFocus.textContent =
            "No tasks for today";

    } else {

        todayFocus.textContent =
            todayTasks.length +
            (
                todayTasks.length === 1
                    ? " task for today"
                    : " tasks for today"
            );
    }
}


// ==========================================
// PLANNER UPCOMING COUNT
// ==========================================

function updatePlannerCount() {

    const plannerData =
        JSON.parse(
            localStorage.getItem(
                "intelliLifePlanner"
            )
        ) || [];


    const plannerCount =
        document.getElementById(
            "plannerCount"
        );


    if (!plannerCount) return;


    const now =
        new Date();


    const today =
        now.getFullYear() +
        "-" +
        String(
            now.getMonth() + 1
        ).padStart(2, "0") +
        "-" +
        String(
            now.getDate()
        ).padStart(2, "0");


    const upcomingTasks =
        plannerData.filter(task => {

            return (
                task.date > today &&
                task.completed !== true
            );

        });


    plannerCount.textContent =
        upcomingTasks.length;
}


// ==========================================
// FINANCE AMOUNT
// ==========================================

function updateFinanceAmount() {

    const transactions =
        JSON.parse(
            localStorage.getItem(
                "intelliLifeFinance"
            )
        ) || [];


    const financeAmount =
        document.getElementById(
            "financeAmount"
        );


    if (!financeAmount) return;


    const currentMonth =
        new Date().getMonth();


    const currentYear =
        new Date().getFullYear();


    const thisMonthTransactions =
        transactions.filter(
            transaction => {

                const transactionDate =
                    new Date(
                        transaction.date
                    );


                return (
                    transactionDate.getMonth() ===
                        currentMonth &&

                    transactionDate.getFullYear() ===
                        currentYear
                );

            }
        );


    const totalIncome =
        thisMonthTransactions
            .filter(
                transaction =>
                    transaction.type ===
                    "income"
            )
            .reduce(
                (
                    sum,
                    transaction
                ) =>
                    sum +
                    Number(
                        transaction.amount
                    ),
                0
            );


    const totalExpense =
        thisMonthTransactions
            .filter(
                transaction =>
                    transaction.type ===
                    "expense"
            )
            .reduce(
                (
                    sum,
                    transaction
                ) =>
                    sum +
                    Number(
                        transaction.amount
                    ),
                0
            );


    const balance =
        totalIncome -
        totalExpense;


    financeAmount.textContent =
        "₹" + balance;
}


// ==========================================
// INITIALIZE DASHBOARD
// ==========================================

function initializeDashboard() {

    updateTaskCardsFromPlanner();

    updateGoalProgress();

    updateTodayFocus();

    updatePlannerCount();

    updateFinanceAmount();

    loadTasks();
}


// ==========================================
// PAGE LOAD
// ==========================================

document.addEventListener(
    "DOMContentLoaded",
    function() {

        initializeDashboard();

    }
);