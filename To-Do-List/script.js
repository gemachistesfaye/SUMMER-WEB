const inputBox = document.getElementById('input-box');
const addButton = document.getElementById('add-button');
const listContainer = document.getElementById('list-container');
const prioritySelect = document.getElementById('priority-select');
const emptyState = document.getElementById('emptyState');
const clearAll = document.getElementById('clearAll');
const clearAllBtn = document.getElementById('clearAllBtn');
const dateDisplay = document.getElementById('dateDisplay');

let tasks = JSON.parse(localStorage.getItem('todoTasks') || '[]');
let activeFilter = 'all';

// ===== Date Display =====
function updateDate() {
    const now = new Date();
    const options = { weekday: 'long', month: 'long', day: 'numeric' };
    dateDisplay.textContent = now.toLocaleDateString('en-US', options);
}
updateDate();

// ===== Save & Load =====
function saveTasks() {
    localStorage.setItem('todoTasks', JSON.stringify(tasks));
}

// ===== Render Tasks =====
function renderTasks() {
    listContainer.innerHTML = '';

    const filtered = tasks.filter(task => {
        if (activeFilter === 'pending') return !task.done;
        if (activeFilter === 'done') return task.done;
        return true;
    });

    if (filtered.length === 0) {
        emptyState.classList.remove('hidden');
    } else {
        emptyState.classList.add('hidden');
    }

    filtered.forEach((task, i) => {
        const li = document.createElement('li');
        li.className = task.done ? 'checked' : '';
        li.dataset.id = task.id;

        li.innerHTML = `
            <div class="task-check">
                <i class="fas fa-check"></i>
            </div>
            <span class="task-text">${task.text}</span>
            <span class="task-priority ${task.priority}">${task.priority}</span>
            <button class="task-delete" data-id="${task.id}"><i class="fas fa-trash-can"></i></button>
        `;

        // Toggle done
        li.addEventListener('click', (e) => {
            if (e.target.closest('.task-delete')) return;
            task.done = !task.done;
            saveTasks();
            renderTasks();
            updateStats();
        });

        listContainer.appendChild(li);
    });

    // Delete buttons
    document.querySelectorAll('.task-delete').forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.stopPropagation();
            const id = parseInt(btn.dataset.id);
            tasks = tasks.filter(t => t.id !== id);
            saveTasks();
            renderTasks();
            updateStats();
        });
    });

    updateStats();
}

// ===== Add Task =====
function addTask() {
    const text = inputBox.value.trim();
    if (!text) {
        inputBox.style.borderColor = '#f44336';
        inputBox.focus();
        setTimeout(() => inputBox.style.borderColor = 'rgba(255,255,255,0.1)', 2000);
        return;
    }

    tasks.unshift({
        id: Date.now(),
        text: text,
        priority: prioritySelect.value,
        done: false,
        createdAt: new Date().toISOString()
    });

    inputBox.value = '';
    saveTasks();
    renderTasks();
}

// ===== Update Stats =====
function updateStats() {
    document.getElementById('totalCount').textContent = tasks.length;
    document.getElementById('pendingCount').textContent = tasks.filter(t => !t.done).length;
    document.getElementById('doneCount').textContent = tasks.filter(t => t.done).length;

    const hasCompleted = tasks.some(t => t.done);
    clearAll.classList.toggle('hidden', !hasCompleted);
}

// ===== Filters =====
document.querySelectorAll('.filter-btn').forEach(btn => {
    btn.addEventListener('click', () => {
        document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        activeFilter = btn.dataset.filter;
        renderTasks();
    });
});

// ===== Clear Completed =====
clearAllBtn.addEventListener('click', () => {
    tasks = tasks.filter(t => !t.done);
    saveTasks();
    renderTasks();
});

// ===== Event Listeners =====
addButton.addEventListener('click', addTask);
inputBox.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') addTask();
});

// ===== Init =====
renderTasks();
