let goalsData = [
  {
    id: 1,
    title: "Learn Python",
    deadline: "30 Aug 2026",
    subtasks: [
      { id: 101, text: "Complete Python Basics", completed: true },
      { id: 102, text: "Learn Functions", completed: true },
      { id: 103, text: "Learn OOP Concepts", completed: true },
      { id: 104, text: "Build Mini Projects", completed: false }
    ]
  },
  {
    id: 2,
    title: "Build Major Project",
    deadline: "15 Sep 2026",
    subtasks: [
      { id: 201, text: "System Architecture", completed: true },
      { id: 202, text: "Frontend Implementation", completed: true },
      { id: 203, text: "Backend API Integration", completed: false }
    ]
  }
];

const goalsContainer = document.getElementById("goalsContainer");
const goalModal = document.getElementById("goalModal");
const openModalBtn = document.getElementById("openGoalModalBtn");
const closeModalBtn = document.getElementById("closeGoalModalBtn");
const cancelModalBtn = document.getElementById("cancelModalBtn");
const addGoalForm = document.getElementById("addGoalForm");
const addSubtaskInputBtn = document.getElementById("addSubtaskInputBtn");
const subtasksContainer = document.getElementById("subtasksContainer");

function calculateProgress(subtasks) {
  if (!subtasks || subtasks.length === 0) return 0;
  const completedCount = subtasks.filter((st) => st.completed).length;
  return Math.round((completedCount / subtasks.length) * 100);
}

function renderGoals() {
  goalsContainer.innerHTML = "";

  goalsData.forEach((goal) => {
    const progress = calculateProgress(goal.subtasks);

    const cardHTML = `
      <div class="goal-card" data-id="${goal.id}">
        <div class="goal-card-header">
          <div class="goal-title-container">
            <div class="goal-icon-badge">
              <i class="fa-solid fa-bullseye"></i>
            </div>
            <h3 class="goal-title">${goal.title}</h3>
          </div>
        </div>

        <div class="progress-section">
          <div class="progress-info">
            <span>Progress</span>
            <span>${progress}%</span>
          </div>
          <div class="progress-bar-bg">
            <div class="progress-bar-fill" style="width: ${progress}%;"></div>
          </div>
        </div>

        <div class="goal-deadline">
          <i class="fa-regular fa-clock"></i> Deadline: ${goal.deadline}
        </div>

        <div class="subtasks-list">
          ${goal.subtasks
            .map(
              (st) => `
            <label class="subtask-item ${st.completed ? "completed" : ""}">
              <input 
                type="checkbox" 
                ${st.completed ? "checked" : ""} 
                onchange="toggleSubtask(${goal.id}, ${st.id})"
              />
              <span>${st.text}</span>
            </label>
          `
            )
            .join("")}
        </div>

        <div class="goal-card-footer">
          <button class="btn-action" onclick="editGoal(${goal.id})">
            <i class="fa-regular fa-pen-to-square"></i> Edit
          </button>
          <button class="btn-action btn-delete" onclick="deleteGoal(${goal.id})">
            <i class="fa-regular fa-trash-can"></i> Delete
          </button>
        </div>
      </div>
    `;

    goalsContainer.insertAdjacentHTML("beforeend", cardHTML);
  });
}

function toggleSubtask(goalId, subtaskId) {
  const goal = goalsData.find((g) => g.id === goalId);
  if (goal) {
    const subtask = goal.subtasks.find((st) => st.id === subtaskId);
    if (subtask) {
      subtask.completed = !subtask.completed;
      renderGoals();
    }
  }
}

function deleteGoal(goalId) {
  goalsData = goalsData.filter((g) => g.id !== goalId);
  renderGoals();
}

function editGoal(goalId) {
  const goal = goalsData.find((g) => g.id === goalId);
  if (goal) {
    const newTitle = prompt("Edit Goal Title:", goal.title);
    if (newTitle && newTitle.trim() !== "") {
      goal.title = newTitle.trim();
      renderGoals();
    }
  }
}

function openModal() {
  goalModal.classList.add("active");
}

function closeModal() {
  goalModal.classList.remove("active");
  addGoalForm.reset();
  subtasksContainer.innerHTML = `
    <input type="text" class="subtask-input" placeholder="Subtask 1" />
    <input type="text" class="subtask-input" placeholder="Subtask 2" />
  `;
}

addSubtaskInputBtn.addEventListener("click", () => {
  const inputCount = subtasksContainer.querySelectorAll(".subtask-input").length + 1;
  const input = document.createElement("input");
  input.type = "text";
  input.className = "subtask-input";
  input.placeholder = `Subtask ${inputCount}`;
  subtasksContainer.appendChild(input);
});

addGoalForm.addEventListener("submit", (e) => {
  e.preventDefault();

  const title = document.getElementById("goalTitle").value.trim();
  const rawDate = document.getElementById("goalDeadline").value;
  
  const dateObj = new Date(rawDate);
  const formattedDate = dateObj.toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric"
  });

  const subtaskInputs = subtasksContainer.querySelectorAll(".subtask-input");
  const subtasks = [];

  subtaskInputs.forEach((input, index) => {
    if (input.value.trim() !== "") {
      subtasks.push({
        id: Date.now() + index,
        text: input.value.trim(),
        completed: false
      });
    }
  });

  const newGoal = {
    id: Date.now(),
    title: title,
    deadline: formattedDate,
    subtasks: subtasks
  };

  goalsData.push(newGoal);
  renderGoals();
  closeModal();
});

openModalBtn.addEventListener("click", openModal);
closeModalBtn.addEventListener("click", closeModal);
cancelModalBtn.addEventListener("click", closeModal);

renderGoals();