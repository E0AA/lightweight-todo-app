const todoInput = document.getElementById("todo-input");
const addBtn = document.getElementById("add-btn");
const todoList = document.getElementById("todo-list");

async function apiListTasks() {
    const res = await fetch("/tasks/list");
    return res.json();
}

async function apiCreateTask(text) {
    return fetch("/tasks/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text })
    });
}

async function apiToggleTask(id, completed) {
    return fetch("/tasks/update", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, completed })
    });
}

async function apiDeleteTask(id) {
    return fetch("/tasks/delete", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id })
    });
}

function renderTask(task) {
    const li = document.createElement("li");
    li.className = "todo-item";
    if (task.completed) li.classList.add("completed");

    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.checked = task.completed;

    checkbox.addEventListener("change", async () => {
        await apiToggleTask(task.id, checkbox.checked);
        li.classList.toggle("completed", checkbox.checked);
    });

    const textSpan = document.createElement("span");
    textSpan.className = "todo-text";
    textSpan.textContent = task.text;

    const delBtn = document.createElement("button");
    delBtn.className = "action-btn";
    delBtn.innerHTML = `
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <path d="M3 6.98996C8.81444 4.87965 15.1856 4.87965 21 6.98996"/>
            <path d="M8.00977 5.71997C8.00977 4.6591 8.43119 3.64175 9.18134 2.8916C9.93148 2.14146 10.9489 1.71997 12.0098 1.71997C13.0706 1.71997 14.0881 2.14146 14.8382 2.8916C15.5883 3.64175 16.0098 4.6591 16.0098 5.71997"/>
            <path d="M12 13V18"/>
            <path d="M19 9.98999L18.33 17.99C18.2225 19.071 17.7225 20.0751 16.9246 20.8123C16.1266 21.5494 15.0861 21.9684 14 21.99H10C8.91389 21.9684 7.87336 21.5494 7.07541 20.8123C6.27745 20.0751 5.77745 19.071 5.67001 17.99L5 9.98999"/>
        </svg>
    `;

    delBtn.addEventListener("click", async () => {
        await apiDeleteTask(task.id);
        li.remove();
    });

    li.appendChild(checkbox);
    li.appendChild(textSpan);
    li.appendChild(delBtn);

    return li;
}

function renderList(tasks) {
    todoList.innerHTML = "";
    tasks.forEach(task => {
        todoList.appendChild(renderTask(task));
    });
}

async function handleAddTask() {
    const text = todoInput.value.trim();
    if (!text) return;

    await apiCreateTask(text);
    todoInput.value = "";
    loadTasks();
}

addBtn.addEventListener("click", handleAddTask);
todoInput.addEventListener("keypress", e => {
    if (e.key === "Enter") handleAddTask();
});

async function loadTasks() {
    const tasks = await apiListTasks();
    renderList(tasks);
}

loadTasks();
