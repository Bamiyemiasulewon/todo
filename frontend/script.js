// API Configuration
const API_BASE_URL = 'http://localhost:3000/api';

// State management
let todos = [];
let currentFilter = 'all';
let editingTodoId = null;

// DOM Elements
const todoForm = document.getElementById('todo-form');
const todoInput = document.getElementById('todo-input');
const todoList = document.getElementById('todo-list');
const itemsLeft = document.getElementById('items-left');
const filterButtons = document.querySelectorAll('.filter-btn');
const clearCompletedBtn = document.getElementById('clear-completed');

// Event Listeners
document.addEventListener('DOMContentLoaded', () => {
    fetchTodos();
    setupEventListeners();
});

function setupEventListeners() {
    todoForm.addEventListener('submit', handleSubmit);
    filterButtons.forEach(btn => {
        btn.addEventListener('click', () => handleFilter(btn.dataset.filter));
    });
    clearCompletedBtn.addEventListener('click', handleClearCompleted);
}

// API Functions
async function fetchTodos() {
    try {
        showLoading();
        const response = await fetch(`${API_BASE_URL}/todos`);
        if (!response.ok) throw new Error('Failed to fetch todos');
        todos = await response.json();
        renderTodos();
    } catch (error) {
        showError('Failed to load todos');
        console.error('Error:', error);
    } finally {
        hideLoading();
    }
}

async function createTodo(title) {
    try {
        const response = await fetch(`${API_BASE_URL}/todos`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ title })
        });
        if (!response.ok) throw new Error('Failed to create todo');
        const newTodo = await response.json();
        todos.push(newTodo);
        renderTodos();
        showSuccess('Todo created successfully');
    } catch (error) {
        showError('Failed to create todo');
        console.error('Error:', error);
    }
}

async function updateTodo(id, updates) {
    try {
        const response = await fetch(`${API_BASE_URL}/todos/${id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(updates)
        });
        if (!response.ok) throw new Error('Failed to update todo');
        const updatedTodo = await response.json();
        todos = todos.map(todo => todo.id === id ? updatedTodo : todo);
        renderTodos();
    } catch (error) {
        showError('Failed to update todo');
        console.error('Error:', error);
    }
}

async function deleteTodo(id) {
    try {
        const response = await fetch(`${API_BASE_URL}/todos/${id}`, {
            method: 'DELETE'
        });
        if (!response.ok) throw new Error('Failed to delete todo');
        todos = todos.filter(todo => todo.id !== id);
        renderTodos();
        showSuccess('Todo deleted successfully');
    } catch (error) {
        showError('Failed to delete todo');
        console.error('Error:', error);
    }
}

// Event Handlers
async function handleSubmit(e) {
    e.preventDefault();
    const title = todoInput.value.trim();
    if (!title) return;

    await createTodo(title);
    todoInput.value = '';
}

function handleFilter(filter) {
    currentFilter = filter;
    filterButtons.forEach(btn => {
        btn.classList.toggle('active', btn.dataset.filter === filter);
    });
    renderTodos();
}

async function handleClearCompleted() {
    const completedTodos = todos.filter(todo => todo.completed);
    for (const todo of completedTodos) {
        await deleteTodo(todo.id);
    }
}

// UI Functions
function renderTodos() {
    const filteredTodos = filterTodos();
    todoList.innerHTML = filteredTodos.map(todo => `
        <div class="todo-item ${todo.completed ? 'completed' : ''}" data-id="${todo.id}">
            <input 
                type="checkbox" 
                class="todo-checkbox" 
                ${todo.completed ? 'checked' : ''}
                onchange="toggleTodo(${todo.id})"
            >
            <span 
                class="todo-text ${editingTodoId === todo.id ? 'editing' : ''}"
                ondblclick="startEditing(${todo.id})"
            >${todo.title}</span>
            <button class="delete-btn" onclick="deleteTodo(${todo.id})">×</button>
        </div>
    `).join('');

    updateItemsCount();
}

function filterTodos() {
    switch (currentFilter) {
        case 'active':
            return todos.filter(todo => !todo.completed);
        case 'completed':
            return todos.filter(todo => todo.completed);
        default:
            return todos;
    }
}

function updateItemsCount() {
    const activeCount = todos.filter(todo => !todo.completed).length;
    itemsLeft.textContent = activeCount;
}

async function toggleTodo(id) {
    const todo = todos.find(t => t.id === id);
    if (todo) {
        await updateTodo(id, { completed: !todo.completed });
    }
}

function startEditing(id) {
    editingTodoId = id;
    renderTodos();
    const todoElement = document.querySelector(`[data-id="${id}"] .todo-text`);
    todoElement.contentEditable = true;
    todoElement.focus();

    // Handle editing completion
    todoElement.addEventListener('blur', finishEditing);
    todoElement.addEventListener('keydown', e => {
        if (e.key === 'Enter') {
            e.preventDefault();
            finishEditing(e);
        } else if (e.key === 'Escape') {
            e.preventDefault();
            cancelEditing();
        }
    });
}

async function finishEditing(e) {
    const todoElement = e.target;
    const id = parseInt(todoElement.parentElement.dataset.id);
    const newTitle = todoElement.textContent.trim();

    if (newTitle) {
        await updateTodo(id, { title: newTitle });
    } else {
        cancelEditing();
    }

    editingTodoId = null;
    todoElement.contentEditable = false;
    renderTodos();
}

function cancelEditing() {
    editingTodoId = null;
    renderTodos();
}

// Utility Functions
function showLoading() {
    todoList.classList.add('loading');
}

function hideLoading() {
    todoList.classList.remove('loading');
}

function showError(message) {
    const errorDiv = document.createElement('div');
    errorDiv.className = 'error-message';
    errorDiv.textContent = message;
    todoList.parentElement.insertBefore(errorDiv, todoList);
    setTimeout(() => errorDiv.remove(), 3000);
}

function showSuccess(message) {
    const successDiv = document.createElement('div');
    successDiv.className = 'success-message';
    successDiv.textContent = message;
    todoList.parentElement.insertBefore(successDiv, todoList);
    setTimeout(() => successDiv.remove(), 3000);
} 