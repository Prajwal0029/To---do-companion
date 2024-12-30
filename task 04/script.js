// Get elements
const inputBox = document.getElementById('input-box');
const datePicker = document.getElementById('date-picker');
const listContainer = document.getElementById('list-container');
const completedCount = document.getElementById('completed-count');
const incompleteCount = document.getElementById('incomplete-count');

// Load tasks from local storage
window.onload = () => {
    const tasks = JSON.parse(localStorage.getItem('tasks')) || [];
    tasks.forEach(task => renderTask(task.text, task.completed, task.date));
    updateTaskSummary();
};

// Add new task
function addTask() {
    const taskText = inputBox.value.trim();
    const taskDate = datePicker.value;

    if (taskText === '') {
        alert('Please enter a task!');
        return;
    }

    if (!taskDate) {
        alert('Please select a date!');
        return;
    }

    renderTask(taskText, false, taskDate);
    saveTask(taskText, false, taskDate);
    inputBox.value = '';
    datePicker.value = '';
    updateTaskSummary();
}

// Render task in the UI
function renderTask(text, completed, date) {
    const li = document.createElement('li');

    // Checkbox
    const checkbox = document.createElement('input');
    checkbox.type = 'checkbox';
    checkbox.checked = completed;
    checkbox.className = 'checkbox';
    checkbox.onclick = () => {
        li.classList.toggle('completed');
        updateTaskStatus(text, checkbox.checked);
        updateTaskSummary();
    };
    li.appendChild(checkbox);

    // Task text
    const taskSpan = document.createElement('span');
    taskSpan.textContent = text;
    li.appendChild(taskSpan);

    // Task date
    const dateSpan = document.createElement('span');
    dateSpan.className = 'date';
    dateSpan.textContent = `Due: ${date}`;
    li.appendChild(dateSpan);

    if (completed) {
        li.classList.add('completed');
    }

    // Actions
    const actions = document.createElement('div');
    actions.className = 'actions';

    // Edit button
    const editBtn = document.createElement('button');
    editBtn.textContent = 'Edit';
    editBtn.className = 'edit';
    editBtn.onclick = () => editTask(li, taskSpan, dateSpan);
    actions.appendChild(editBtn);

    // Delete button
    const deleteBtn = document.createElement('button');
    deleteBtn.textContent = 'Delete';
    deleteBtn.onclick = () => {
        li.remove();
        deleteTask(text);
        updateTaskSummary();
    };
    actions.appendChild(deleteBtn);

    li.appendChild(actions);
    listContainer.appendChild(li);
}

// Save task to local storage
function saveTask(text, completed, date) {
    const tasks = JSON.parse(localStorage.getItem('tasks')) || [];
    tasks.push({ text, completed, date });
    localStorage.setItem('tasks', JSON.stringify(tasks));
}

// Update task status in local storage
function updateTaskStatus(text, completed) {
    const tasks = JSON.parse(localStorage.getItem('tasks'));
    const task = tasks.find(task => task.text === text);
    task.completed = completed;
    localStorage.setItem('tasks', JSON.stringify(tasks));
}

// Edit task
function editTask(li, taskSpan, dateSpan) {
    const newText = prompt('Edit your task:', taskSpan.textContent);
    const newDate = prompt('Edit your due date:', dateSpan.textContent.replace('Due: ', ''));

    if (newText && newText.trim() !== '') {
        const oldText = taskSpan.textContent;
        taskSpan.textContent = newText.trim();
        dateSpan.textContent = `Due: ${newDate}`;
        updateTaskText(oldText, newText.trim(), newDate);
    }
}

// Update task text and date in local storage
function updateTaskText(oldText, newText, newDate) {
    const tasks = JSON.parse(localStorage.getItem('tasks'));
    const task = tasks.find(task => task.text === oldText);
    task.text = newText;
    task.date = newDate;
    localStorage.setItem('tasks', JSON.stringify(tasks));
}

// Delete task from local storage
function deleteTask(text) {
    const tasks = JSON.parse(localStorage.getItem('tasks'));
    const filteredTasks = tasks.filter(task => task.text !== text);
    localStorage.setItem('tasks', JSON.stringify(filteredTasks));
}

// Clear all tasks
function clearAllTasks() {
    if (confirm('Are you sure you want to clear all tasks?')) {
        listContainer.innerHTML = '';
        localStorage.removeItem('tasks');
        updateTaskSummary();
    }
}

// Update task summary
function updateTaskSummary() {
    const tasks = JSON.parse(localStorage.getItem('tasks')) || [];
    const completedTasks = tasks.filter(task => task.completed).length;
    const incompleteTasks = tasks.length - completedTasks;

    completedCount.textContent = completedTasks;
    incompleteCount.textContent = incompleteTasks;
}
