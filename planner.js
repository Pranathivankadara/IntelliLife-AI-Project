/* =========================================
   INTELLILIFE AI - PLANNER
========================================= */


/* =========================================
   DATE
========================================= */

let selectedDate = new Date();

let editingTaskId = null;


/* =========================================
   TASK DATA
========================================= */

let tasks =
    JSON.parse(
        localStorage.getItem("intelliLifePlanner")
    ) || [

        {
            id: 1,
            title: "Revise Machine Learning",
            time: "09:00",
            priority: "High",
            category: "Study",
            description:
                "Revise important ML concepts and algorithms.",
            date: getDateKey(new Date()),
            completed: false
        },

        {
            id: 2,
            title: "Work on IntelliLife AI",
            time: "14:00",
            priority: "Medium",
            category: "Project",
            description:
                "Complete the Planner module.",
            date: getDateKey(new Date()),
            completed: false
        },

        {
            id: 3,
            title: "Read NLP Notes",
            time: "18:00",
            priority: "Low",
            category: "Study",
            description:
                "Review NLP important questions.",
            date: getDateKey(new Date()),
            completed: true
        }

    ];


/* =========================================
   DATE KEY
========================================= */

function getDateKey(date) {

    const year =
        date.getFullYear();

    const month =
        String(
            date.getMonth() + 1
        ).padStart(2, "0");

    const day =
        String(
            date.getDate()
        ).padStart(2, "0");


    return `${year}-${month}-${day}`;
}


/* =========================================
   FORMAT TIME
========================================= */

function formatTime(time) {

    const [hours, minutes] =
        time.split(":");


    let hour =
        parseInt(hours);

    const period =
        hour >= 12 ? "PM" : "AM";


    hour =
        hour % 12 || 12;


    return `${hour}:${minutes} ${period}`;
}


/* =========================================
   SAVE
========================================= */

function saveTasks() {

    localStorage.setItem(
        "intelliLifePlanner",
        JSON.stringify(tasks)
    );

}


/* =========================================
   DISPLAY DATE
========================================= */

function updateDateDisplay() {

    const day =
        selectedDate.toLocaleDateString(
            "en-US",
            {
                weekday: "long"
            }
        );


    const date =
        selectedDate.getDate();


    const monthYear =
        selectedDate.toLocaleDateString(
            "en-US",
            {
                month: "long",
                year: "numeric"
            }
        );


    document.getElementById("dayName")
        .innerText = day;


    document.getElementById("dateNumber")
        .innerText =
        String(date).padStart(2, "0");


    document.getElementById("monthYear")
        .innerText = monthYear;


    renderTasks();

}


/* =========================================
   CHANGE DAY
========================================= */

function changeDay(amount) {

    selectedDate.setDate(
        selectedDate.getDate() + amount
    );


    updateDateDisplay();

}


/* =========================================
   TODAY
========================================= */

function goToToday() {

    selectedDate =
        new Date();


    updateDateDisplay();

}


/* =========================================
   TODAY TASKS
========================================= */

function getTodayTasks() {

    const dateKey =
        getDateKey(selectedDate);


    return tasks
        .filter(
            task => task.date === dateKey
        )
        .sort(
            (a, b) =>
                a.time.localeCompare(b.time)
        );

}


/* =========================================
   RENDER TASKS
========================================= */

function renderTasks() {

    const todayTasks =
        getTodayTasks();


    const filter =
        document.getElementById(
            "taskFilter"
        ).value;


    let filteredTasks =
        todayTasks;


    if (filter === "Pending") {

        filteredTasks =
            todayTasks.filter(
                task => !task.completed
            );

    }


    if (filter === "Completed") {

        filteredTasks =
            todayTasks.filter(
                task => task.completed
            );

    }


    renderSchedule(todayTasks);

    renderTaskList(filteredTasks);

    updateSummary(todayTasks);

    updatePriority(todayTasks);

}


/* =========================================
   SCHEDULE
========================================= */

function renderSchedule(todayTasks) {

    const container =
        document.getElementById(
            "scheduleList"
        );


    container.innerHTML = "";


    document.getElementById(
        "scheduleCount"
    ).innerText =
        `${todayTasks.length} ${
            todayTasks.length === 1
                ? "Task"
                : "Tasks"
        }`;


    if (todayTasks.length === 0) {

        container.innerHTML = `

            <div class="schedule-empty">

                <div class="schedule-empty-icon">
                    □
                </div>

                <h3>
                    No tasks planned
                </h3>

                <p>
                    Add a task to organize your day.
                </p>

            </div>

        `;

        return;
    }


    todayTasks.forEach(task => {

        container.innerHTML += `

            <div class="
                schedule-item
                ${task.completed ? "completed" : ""}
            ">

                <div class="schedule-time">
                    ${formatTime(task.time)}
                </div>

                <div class="schedule-line"></div>

                <div class="schedule-info">

                    <h4>
                        ${escapeHTML(task.title)}
                    </h4>

                    <p>
                        ${escapeHTML(task.category)}
                    </p>

                </div>

                <span class="schedule-status">

                    ${
                        task.completed
                            ? "Done"
                            : task.priority
                    }

                </span>

            </div>

        `;

    });

}


/* =========================================
   TASK LIST
========================================= */

function renderTaskList(taskList) {

    const container =
        document.getElementById(
            "tasksList"
        );


    container.innerHTML = "";


    if (taskList.length === 0) {

        container.innerHTML = `

            <div class="tasks-empty">

                <h3>
                    No tasks here
                </h3>

                <p>
                    Add a task or change the filter.
                </p>

            </div>

        `;

        return;
    }


    taskList.forEach(task => {

        const priorityClass =
            task.priority === "High"
                ? "priority-high"
                : task.priority === "Medium"
                    ? "priority-medium"
                    : "priority-low";


        container.innerHTML += `

            <div class="
                task-item
                ${task.completed
                    ? "completed-task"
                    : ""}
            ">

                <button
                    class="
                        task-check
                        ${task.completed
                            ? "completed"
                            : ""}
                    "
                    onclick="toggleTask(${task.id})">

                    ${task.completed ? "✓" : ""}

                </button>


                <div class="task-info">

                    <h4>
                        ${escapeHTML(task.title)}
                    </h4>

                    <p>
                        ${formatTime(task.time)}
                        •
                        ${escapeHTML(task.category)}
                    </p>

                </div>


                <span
                    class="
                        task-priority
                        ${priorityClass}
                    ">

                    ${task.priority}

                </span>


                <div class="task-actions">

                    <button
                        onclick="editTask(${task.id})"
                        title="Edit">

                        ✎

                    </button>

                    <button
                        class="delete-task"
                        onclick="deleteTask(${task.id})"
                        title="Delete">

                        ×

                    </button>

                </div>

            </div>

        `;

    });

}


/* =========================================
   SUMMARY
========================================= */

function updateSummary(todayTasks) {

    const total =
        todayTasks.length;


    const completed =
        todayTasks.filter(
            task => task.completed
        ).length;


    const pending =
        total - completed;


    const percentage =
        total === 0
            ? 0
            : Math.round(
                (completed / total) * 100
            );


    document.getElementById(
        "totalTasks"
    ).innerText = total;


    document.getElementById(
        "completedTasks"
    ).innerText = completed;


    document.getElementById(
        "pendingTasks"
    ).innerText = pending;


    document.getElementById(
        "progressPercent"
    ).innerText =
        percentage + "%";


    document.getElementById(
        "circlePercent"
    ).innerText =
        percentage + "%";


    updateProgressCircle(
        percentage
    );


    const progressText =
        document.getElementById(
            "progressText"
        );


    if (total === 0) {

        progressText.innerText =
            "Getting started";

    }
    else if (percentage === 100) {

        progressText.innerText =
            "Great job!";

    }
    else if (percentage >= 50) {

        progressText.innerText =
            "Good progress";

    }
    else {

        progressText.innerText =
            "Keep going";

    }

}


/* =========================================
   PROGRESS CIRCLE
========================================= */

function updateProgressCircle(percent) {

    const degree =
        percent * 3.6;


    document.querySelector(
        ".progress-circle"
    ).style.background = `conic-gradient(
        #6957d8 ${degree}deg,
        #eeeef3 ${degree}deg
    )`;

}


/* =========================================
   PRIORITY
========================================= */

function updatePriority(todayTasks) {

    document.getElementById(
        "highCount"
    ).innerText =
        todayTasks.filter(
            task => task.priority === "High"
        ).length;


    document.getElementById(
        "mediumCount"
    ).innerText =
        todayTasks.filter(
            task => task.priority === "Medium"
        ).length;


    document.getElementById(
        "lowCount"
    ).innerText =
        todayTasks.filter(
            task => task.priority === "Low"
        ).length;

}


/* =========================================
   TOGGLE TASK
========================================= */

function toggleTask(id) {

    const task =
        tasks.find(
            item => item.id === id
        );


    if (!task) {
        return;
    }


    task.completed =
        !task.completed;


    saveTasks();

    renderTasks();

}


/* =========================================
   OPEN ADD MODAL
========================================= */

function openTaskModal() {

    editingTaskId = null;


    document.getElementById(
        "modalTitle"
    ).innerText =
        "Add Task";


    document.getElementById(
        "taskTitle"
    ).value = "";


    document.getElementById(
        "taskTime"
    ).value = "";


    document.getElementById(
        "taskPriority"
    ).value = "Medium";


    document.getElementById(
        "taskCategory"
    ).value = "Study";


    document.getElementById(
        "taskDescription"
    ).value = "";


    document.getElementById(
        "taskModal"
    ).classList.add("show");

}


/* =========================================
   CLOSE MODAL
========================================= */

function closeTaskModal() {

    document.getElementById(
        "taskModal"
    ).classList.remove("show");

}


/* =========================================
   SAVE TASK
========================================= */

document.getElementById(
    "taskForm"
).addEventListener(
    "submit",
    function(event) {

        event.preventDefault();


        const title =
            document.getElementById(
                "taskTitle"
            ).value.trim();


        const time =
            document.getElementById(
                "taskTime"
            ).value;


        const priority =
            document.getElementById(
                "taskPriority"
            ).value;


        const category =
            document.getElementById(
                "taskCategory"
            ).value;


        const description =
            document.getElementById(
                "taskDescription"
            ).value.trim();


        if (!title || !time) {

            alert(
                "Please enter task name and time."
            );

            return;
        }


        /* EDIT */

        if (editingTaskId !== null) {

            const task =
                tasks.find(
                    item =>
                        item.id === editingTaskId
                );


            if (task) {

                task.title =
                    title;

                task.time =
                    time;

                task.priority =
                    priority;

                task.category =
                    category;

                task.description =
                    description;

            }

        }


        /* NEW TASK */

        else {

            tasks.push({

                id: Date.now(),

                title: title,

                time: time,

                priority: priority,

                category: category,

                description: description,

                date:
                    getDateKey(
                        selectedDate
                    ),

                completed: false

            });

        }


        saveTasks();

        closeTaskModal();

        renderTasks();

    }
);


/* =========================================
   EDIT TASK
========================================= */

function editTask(id) {

    const task =
        tasks.find(
            item => item.id === id
        );


    if (!task) {
        return;
    }


    editingTaskId = id;


    document.getElementById(
        "modalTitle"
    ).innerText =
        "Edit Task";


    document.getElementById(
        "taskTitle"
    ).value =
        task.title;


    document.getElementById(
        "taskTime"
    ).value =
        task.time;


    document.getElementById(
        "taskPriority"
    ).value =
        task.priority;


    document.getElementById(
        "taskCategory"
    ).value =
        task.category;


    document.getElementById(
        "taskDescription"
    ).value =
        task.description || "";


    document.getElementById(
        "taskModal"
    ).classList.add("show");

}


/* =========================================
   DELETE TASK
========================================= */

function deleteTask(id) {

    const confirmDelete =
        confirm(
            "Are you sure you want to delete this task?"
        );


    if (!confirmDelete) {
        return;
    }


    tasks =
        tasks.filter(
            task => task.id !== id
        );


    saveTasks();

    renderTasks();

}


/* =========================================
   CLOSE MODAL OUTSIDE
========================================= */

document.getElementById(
    "taskModal"
).addEventListener(
    "click",
    function(event) {

        if (event.target === this) {

            closeTaskModal();

        }

    }
);


/* =========================================
   LOGOUT
========================================= */

function logoutUser() {

    localStorage.removeItem("token");

    localStorage.removeItem("user");

    window.location.href =
        "login.html";

}


/* =========================================
   HTML ESCAPE
========================================= */

function escapeHTML(text) {

    const div =
        document.createElement("div");

    div.textContent =
        text || "";

    return div.innerHTML;

}


/* =========================================
   INITIAL LOAD
========================================= */

updateDateDisplay();