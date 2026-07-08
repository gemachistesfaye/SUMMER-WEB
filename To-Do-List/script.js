const inputBox = document.getElementById('input-box');
const addButton = document.getElementById('add-button');
const listContainer = document.getElementById('list-container');
const emptyState = document.getElementById('emptyState');
const clearAll = document.getElementById('clearAll');
const clearAllBtn = document.getElementById('clearAllBtn');
const dateDisplay = document.getElementById('dateDisplay');
const progressFill = document.getElementById('progressFill');
const progressPercent = document.getElementById('progressPercent');
const taskCount = document.getElementById('taskCount');

let tasks = JSON.parse(localStorage.getItem('todoTasks') || '[]');
let activeFilter = 'all';

// ===== Date =====
function updateDate() {
    const now = new Date();
    const options = { weekday: 'long', month: 'short', day: 'numeric' };
    dateDisplay.textContent = now.toLocaleDateString('en-US', options);
}
updateDate();

// ===== Save =====
function saveTasks() {
    localStorage.setItem('todoTasks', JSON.stringify(tasks));
}

// ===== Update Progress =====
function updateProgress() {
    const total = tasks.length;
    const done = tasks.filter(t => t.done).length;
    const pct = total > 0 ? Math.round((done / total) * 100) : 0;
    progressFill.style.width = pct + '%';
    progressPercent.textContent = pct + '%';

    const pending = total - done;
    taskCount.textContent = total === 0 ? 'No tasks' : pending === 0 ? 'All done!' : `${pending} task${pending !== 1 ? 's' : ''} left`;

    const hasCompleted = tasks.some(t => t.done);
    clearAll.classList.toggle('hidden', !hasCompleted);
}

// ===== Render =====
function renderTasks() {
    listContainer.innerHTML = '';

    const filtered = tasks.filter(task => {
        if (activeFilter === 'pending') return !task.done;
        if (activeFilter === 'done') return task.done;
        return true;
    });

    emptyState.classList.toggle('hidden', filtered.length > 0 || tasks.length > 0);

    // Show empty state for specific filters
    if (filtered.length === 0 && tasks.length > 0) {
        emptyState.classList.remove('hidden');
        emptyState.querySelector('h3').textContent = activeFilter === 'done' ? 'No completed tasks' : 'All tasks done!';
        emptyState.querySelector('p').textContent = activeFilter === 'done' ? 'Complete a task to see it here' : 'Great job!';
        emptyState.querySelector('.empty-icon').textContent = activeFilter === 'done' ? '📝' : '🎊';
    } else if (tasks.length === 0) {
        emptyState.classList.remove('hidden');
        emptyState.querySelector('h3').textContent = 'All caught up!';
        emptyState.querySelector('p').textContent = 'Add a task above to get started';
        emptyState.querySelector('.empty-icon').textContent = '🎉';
    } else {
        emptyState.classList.add('hidden');
    }

    filtered.forEach(task => {
        const li = document.createElement('li');
        li.className = task.done ? 'checked' : '';
        li.innerHTML = `
            <div class="task-check" data-id="${task.id}">
                <i class="fas fa-check"></i>
            </div>
            <span class="task-text">${escapeHtml(task.text)}</span>
            <button class="task-delete" data-id="${task.id}"><i class="fas fa-xmark"></i></button>
        `;
        listContainer.appendChild(li);
    });

    // Toggle check
    document.querySelectorAll('.task-check').forEach(el => {
        el.addEventListener('click', () => {
            const id = parseInt(el.dataset.id);
            const task = tasks.find(t => t.id === id);
            if (task) {
                task.done = !task.done;
                saveTasks();
                renderTasks();
                updateProgress();
            }
        });
    });

    // Delete
    document.querySelectorAll('.task-delete').forEach(el => {
        el.addEventListener('click', (e) => {
            e.stopPropagation();
            const id = parseInt(el.dataset.id);
            const li = el.closest('li');
            li.style.opacity = '0';
            li.style.transform = 'translateX(30px)';
            li.style.transition = 'all 0.2s';
            setTimeout(() => {
                tasks = tasks.filter(t => t.id !== id);
                saveTasks();
                renderTasks();
                updateProgress();
            }, 200);
        });
    });

    updateProgress();
}

function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

// ===== Add Task =====
function addTask() {
    const text = inputBox.value.trim();
    if (!text) {
        inputBox.classList.add('shake');
        inputBox.focus();
        setTimeout(() => inputBox.classList.remove('shake'), 400);
        return;
    }

    tasks.unshift({
        id: Date.now(),
        text: text,
        done: false,
        createdAt: new Date().toISOString()
    });

    inputBox.value = '';
    inputBox.focus();
    saveTasks();
    renderTasks();
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

// ===== Clear Done =====
clearAllBtn.addEventListener('click', () => {
    const doneItems = listContainer.querySelectorAll('.checked');
    doneItems.forEach((li, i) => {
        setTimeout(() => {
            li.style.opacity = '0';
            li.style.transform = 'translateX(30px)';
            li.style.transition = 'all 0.2s';
        }, i * 50);
    });

    setTimeout(() => {
        tasks = tasks.filter(t => !t.done);
        saveTasks();
        renderTasks();
    }, doneItems.length * 50 + 200);
});

// ===== Events =====
addButton.addEventListener('click', addTask);
inputBox.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') addTask();
});

// ===== Init =====
renderTasks();
