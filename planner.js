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

    if (!time) {
        return "";
    }

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
   SELECTED DATE TASKS
========================================= */

function getSelectedDateTasks() {

    const dateKey =
        getDateKey(selectedDate);

    return tasks
        .filter(
            task =>
                task.date === dateKey
        )
        .sort(
            (a, b) =>
                a.time.localeCompare(b.time)
        );
}


/* =========================================
   ALL SAVED TASKS
========================================= */

function getAllTasks() {

    return [...tasks].sort(
        (a, b) => {

            const dateCompare =
                a.date.localeCompare(b.date);

            if (dateCompare !== 0) {
                return dateCompare;
            }

            return a.time.localeCompare(b.time);
        }
    );
}


/* =========================================
   RENDER TASKS
========================================= */

function renderTasks() {

    /*
       IMPORTANT:

       Today's Schedule
       → selected date tasks

       My Tasks
       → ALL saved Planner tasks
    */

    const selectedDateTasks =
        getSelectedDateTasks();

    const allTasks =
        getAllTasks();


    const filterElement =
        document.getElementById(
            "taskFilter"
        );

    const filter =
        filterElement
            ? filterElement.value
            : "All";


    let filteredTasks =
        allTasks;


    /* =====================================
       ALL
    ===================================== */

    if (filter === "All") {

        filteredTasks =
            allTasks;
    }


    /* =====================================
       PENDING
    ===================================== */

    else if (filter === "Pending") {

        filteredTasks =
            allTasks.filter(
                task =>
                    task.completed !== true
            );
    }


    /* =====================================
       COMPLETED
    ===================================== */

    else if (filter === "Completed") {

        filteredTasks =
            allTasks.filter(
                task =>
                    task.completed === true
            );
    }


    /* =====================================
       RENDER BOTH SECTIONS
    ===================================== */

    renderSchedule(
        selectedDateTasks
    );

    renderTaskList(
        filteredTasks
    );


    /*
       Summary is for the selected day,
       exactly like the Planner page
       originally intended.
    */

    updateSummary(allTasks);
updatePriority(selectedDateTasks);
}


/* =========================================
   SCHEDULE
========================================= */

function renderSchedule(todayTasks) {

    const container =
        document.getElementById(
            "scheduleList"
        );

    if (!container) {
        return;
    }

    container.innerHTML = "";


    const scheduleCount =
        document.getElementById(
            "scheduleCount"
        );

    if (scheduleCount) {

        scheduleCount.innerText =
            `${todayTasks.length} ${
                todayTasks.length === 1
                    ? "Task"
                    : "Tasks"
            }`;
    }


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
                            : escapeHTML(task.priority)
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

    if (!container) {
        return;
    }

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
                        •
                        ${formatDateForDisplay(task.date)}
                    </p>

                </div>


                <span
                    class="
                        task-priority
                        ${priorityClass}
                    ">

                    ${escapeHTML(task.priority)}

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
   FORMAT TASK DATE
========================================= */

function formatDateForDisplay(dateString) {

    if (!dateString) {
        return "";
    }

    const date =
        new Date(
            dateString + "T00:00:00"
        );

    return date.toLocaleDateString(
        "en-US",
        {
            day: "2-digit",
            month: "short",
            year: "numeric"
        }
    );
}


/* =========================================
   SUMMARY
========================================= */

function updateSummary(todayTasks) {

    const total =
        todayTasks.length;


    const completed =
        todayTasks.filter(
            task =>
                task.completed === true
        ).length;


    const pending =
        todayTasks.filter(
            task =>
                task.completed !== true
        ).length;


    const percentage =
        total === 0
            ? 0
            : Math.round(
                (
                    completed /
                    total
                ) * 100
            );


    const totalElement =
        document.getElementById(
            "totalTasks"
        );

    if (totalElement) {

        totalElement.innerText =
            total;
    }


    const completedElement =
        document.getElementById(
            "completedTasks"
        );

    if (completedElement) {

        completedElement.innerText =
            completed;
    }


    const pendingElement =
        document.getElementById(
            "pendingTasks"
        );

    if (pendingElement) {

        pendingElement.innerText =
            pending;
    }


    const progressElement =
        document.getElementById(
            "progressPercent"
        );

    if (progressElement) {

        progressElement.innerText =
            percentage + "%";
    }


    const circleElement =
        document.getElementById(
            "circlePercent"
        );

    if (circleElement) {

        circleElement.innerText =
            percentage + "%";
    }


    updateProgressCircle(
        percentage
    );


    const progressText =
        document.getElementById(
            "progressText"
        );

    if (!progressText) {
        return;
    }


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

    const circle =
        document.querySelector(
            ".progress-circle"
        );

    if (!circle) {
        return;
    }


    const degree =
        percent * 3.6;


    circle.style.background =
        `conic-gradient(
            #6957d8 ${degree}deg,
            #eeeef3 ${degree}deg
        )`;
}


/* =========================================
   PRIORITY
========================================= */

function updatePriority(todayTasks) {

    const highCount =
        document.getElementById(
            "highCount"
        );

    if (highCount) {

        highCount.innerText =
            todayTasks.filter(
                task =>
                    task.priority === "High"
            ).length;
    }


    const mediumCount =
        document.getElementById(
            "mediumCount"
        );

    if (mediumCount) {

        mediumCount.innerText =
            todayTasks.filter(
                task =>
                    task.priority === "Medium"
            ).length;
    }


    const lowCount =
        document.getElementById(
            "lowCount"
        );

    if (lowCount) {

        lowCount.innerText =
            todayTasks.filter(
                task =>
                    task.priority === "Low"
            ).length;
    }
}


/* =========================================
   TOGGLE TASK
========================================= */

function toggleTask(id) {

    const task =
        tasks.find(
            item =>
                item.id === id
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
    ).value =
        "Medium";


    document.getElementById(
        "taskCategory"
    ).value =
        "Study";


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


        /* =====================================
           EDIT
        ===================================== */

        if (editingTaskId !== null) {

            const task =
                tasks.find(
                    item =>
                        item.id ===
                        editingTaskId
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


        /* =====================================
           NEW TASK
        ===================================== */

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
            item =>
                item.id === id
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
            task =>
                task.id !== id
        );


    saveTasks();

    renderTasks();
}


/* =========================================
   CLOSE MODAL OUTSIDE
========================================= */

const taskModal =
    document.getElementById(
        "taskModal"
    );

if (taskModal) {

    taskModal.addEventListener(
        "click",
        function(event) {

            if (
                event.target ===
                this
            ) {

                closeTaskModal();
            }

        }
    );
}


/* =========================================
   LOGOUT
========================================= */

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


/* =========================================
   BACKWARD COMPATIBILITY
========================================= */

function logoutUser() {

    logout();
}


/* =========================================
   HTML ESCAPE
========================================= */

function escapeHTML(text) {

    const div =
        document.createElement(
            "div"
        );

    div.textContent =
        text || "";

    return div.innerHTML;
}


/* =========================================
   INITIAL LOAD
========================================= */

updateDateDisplay();