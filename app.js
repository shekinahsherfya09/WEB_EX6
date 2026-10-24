const form = document.getElementById("taskForm");
const input = document.getElementById("taskInput");
const list = document.getElementById("taskList");
const counter = document.getElementById("counter");
const filterButtons = document.querySelectorAll(".filter-btn");
let tasks = [];
let currentFilter = "all";
try {
    const savedTasks = JSON.parse(localStorage.getItem("tasks"));
    if (Array.isArray(savedTasks)) {
        tasks = savedTasks;
    }
} catch (error) {
    tasks = [];
}
function createTask(text) {
    return {
        id: Date.now() + Math.random(),
        text: text,
        done: false
    };
}
function addTask(text) {
    tasks.push(createTask(text));
    saveAndRender();
}
function toggleTask(id) {
    tasks = tasks.map(t =>
        t.id === id ? { ...t, done: !t.done } : t
    );
    saveAndRender();
}
function deleteTask(id) {
    tasks = tasks.filter(t => t.id !== id);
    saveAndRender();
}
function getVisible() {
    if (currentFilter === "open") {
        return tasks.filter(t => !t.done);
    }
    if (currentFilter === "done") {
        return tasks.filter(t => t.done);
    }
    return tasks;
}
function countOpen() {
    return tasks.filter(t => !t.done).length;
}
function taskItem(t) {
    const li = document.createElement("li");
    li.className = "task-item" + (t.done ? " completed" : "");
    const text = document.createElement("span");
    text.className = "task-text";
    text.textContent = t.text;
    const completeButton = document.createElement("button");
    completeButton.type = "button";
    completeButton.className = "complete-btn";
    completeButton.textContent = t.done ? "Undo" : "Complete";
    completeButton.addEventListener("click", () => toggleTask(t.id));
    const deleteButton = document.createElement("button");
    deleteButton.type = "button";
    deleteButton.className = "delete-btn";
    deleteButton.textContent = "Delete";
    deleteButton.addEventListener("click", () => deleteTask(t.id));
    li.append(text, completeButton, deleteButton);
    return li;
}
function renderTasks() {
    list.innerHTML = "";
    const visibleTasks = getVisible();
    if (visibleTasks.length === 0) {
        const emptyMessage = document.createElement("li");
        emptyMessage.className = "empty";
        emptyMessage.textContent = "No tasks to display.";
        list.appendChild(emptyMessage);
    } else {
        visibleTasks.forEach(t => {
            list.appendChild(taskItem(t));
        });
    }
    counter.textContent = countOpen() + " left";
}
function saveAndRender() {
    localStorage.setItem("tasks", JSON.stringify(tasks));
    renderTasks();
}
function handleSubmit(event) {
    event.preventDefault();
    const text = input.value.trim();
    if (text !== "") {
        addTask(text);
        input.value = "";
    }
}
form.addEventListener("submit", handleSubmit);
filterButtons.forEach(button => {
    button.addEventListener("click", function() {
        currentFilter = button.dataset.filter;

        filterButtons.forEach(btn => {
            btn.classList.remove("active");
        });

        button.classList.add("active");
        renderTasks();
    });
});
renderTasks();
