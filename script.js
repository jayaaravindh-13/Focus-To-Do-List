const taskForm = document.getElementById("taskForm");
const taskList = document.getElementById("taskList");
const searchInput = document.getElementById("searchInput");
const categoryFilter = document.getElementById("categoryFilter");

let tasks = JSON.parse(localStorage.getItem("taggedTasks")) || [];

function saveTasks() {
  localStorage.setItem("taggedTasks", JSON.stringify(tasks));
}

function updateCategoryOptions() {
  const uniqueCategories = [...new Set(tasks.map(task => task.category))];
  categoryFilter.innerHTML = `<option value="all">All Categories</option>`;
  uniqueCategories.forEach(cat => {
    categoryFilter.innerHTML += `<option value="${cat}">${cat}</option>`;
  });
}

function renderTasks() {
  const search = searchInput.value.toLowerCase();
  const selectedCategory = categoryFilter.value;
  taskList.innerHTML = "";

  const filtered = tasks.filter(task => {
    const matchesSearch = task.text.toLowerCase().includes(search) ||
                          task.tags.join(",").toLowerCase().includes(search);
    const matchesCategory = selectedCategory === "all" || task.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  filtered.forEach((task, index) => {
    const li = document.createElement("li");
    li.className = "task-item";

    if (task.completed) {
      li.classList.add("completed");
    }

    li.innerHTML = `
      <div class="task-top">
        <span>${task.text}</span>
        <small>${task.category}</small>
      </div>
      <div class="task-tags">#${task.tags.join(" #")}</div>
      <div class="task-buttons">
        <button class="complete">✓</button>
        <button class="delete">🗑</button>
      </div>
    `;

    li.querySelector(".complete").onclick = () => {
      task.completed = !task.completed;
      saveTasks();
      renderTasks();
    };

    li.querySelector(".delete").onclick = () => {
      tasks.splice(index, 1);
      saveTasks();
      updateCategoryOptions();
      renderTasks();
    };

    taskList.appendChild(li);
  });
}

taskForm.onsubmit = (e) => {
  e.preventDefault();
  const text = document.getElementById("taskText").value.trim();
  const tags = document.getElementById("taskTags").value.split(",").map(tag => tag.trim()).filter(Boolean);
  const category = document.getElementById("taskCategory").value;

  if (text) {
    tasks.push({ text, tags, category, completed: false });
    saveTasks();
    updateCategoryOptions();
    taskForm.reset();
    renderTasks();
  }
};

searchInput.addEventListener("input", renderTasks);
categoryFilter.addEventListener("change", renderTasks);

updateCategoryOptions();
renderTasks();