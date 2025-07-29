// State management
let todos = [];
let currentFilter = 'all';
let nextId = 1;

// DOM elements
const todoInput = document.getElementById('todo-input');
const addBtn = document.getElementById('add-btn');
const todoList = document.getElementById('todo-list');
const itemCount = document.getElementById('item-count');
const clearCompletedBtn = document.getElementById('clear-completed');
const filterButtons = document.querySelectorAll('.filter-btn');

// Load todos from localStorage on startup
function loadTodos() {
    try {
        const saved = localStorage.getItem('todos');
        if (saved) {
            const parsed = JSON.parse(saved);
            // Validate that we got an array
            if (Array.isArray(parsed)) {
                todos = parsed;
                nextId = todos.length > 0 ? Math.max(...todos.map(t => t.id)) + 1 : 1;
            } else {
                console.error('Invalid todo data in localStorage');
                todos = [];
            }
        }
    } catch (error) {
        console.error('Error loading todos:', error);
        todos = [];
    }
    renderTodos();
}

// Save todos to localStorage
function saveTodos() {
    try {
        localStorage.setItem('todos', JSON.stringify(todos));
    } catch (error) {
        console.error('Error saving todos:', error);
        alert('Unable to save todos. You might be out of storage space.');
    }
}

// Add a new todo
function addTodo() {
    const text = todoInput.value.trim();
    if (text === '') return;
    
    const newTodo = {
        id: nextId++,
        text: text,
        completed: false
    };
    
    todos.push(newTodo);
    todoInput.value = '';
    saveTodos();
    renderTodos();
}

// Toggle todo completion
function toggleTodo(id) {
    const todo = todos.find(t => t.id === id);
    if (todo) {
        todo.completed = !todo.completed;
        saveTodos();
        renderTodos();
    }
}

// Delete a todo
function deleteTodo(id) {
    todos = todos.filter(t => t.id !== id);
    saveTodos();
    renderTodos();
}

// Clear all completed todos
function clearCompleted() {
    todos = todos.filter(t => !t.completed);
    saveTodos();
    renderTodos();
}

// Filter todos based on status
function getFilteredTodos() {
    switch (currentFilter) {
        case 'active':
            return todos.filter(t => !t.completed);
        case 'completed':
            return todos.filter(t => t.completed);
        default:
            return todos;
    }
}

// Helper function to escape HTML
function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

// Render todos to the DOM
function renderTodos() {
    const filteredTodos = getFilteredTodos();
    todoList.innerHTML = '';
    
    filteredTodos.forEach(todo => {
        const li = document.createElement('li');
        li.className = 'todo-item' + (todo.completed ? ' completed' : '');
        li.setAttribute('data-todo-id', todo.id);
        
        li.innerHTML = `
            <input type="checkbox" class="todo-checkbox" ${todo.completed ? 'checked' : ''}>
            <span class="todo-text">${escapeHtml(todo.text)}</span>
            <button class="delete-btn">✕</button>
        `;
        
        // Add event listeners
        const checkbox = li.querySelector('.todo-checkbox');
        const deleteBtn = li.querySelector('.delete-btn');
        
        checkbox.addEventListener('change', () => toggleTodo(todo.id));
        deleteBtn.addEventListener('click', () => deleteTodo(todo.id));
        
        todoList.appendChild(li);
    });
    
    updateItemCount();
}

// Update the item count
function updateItemCount() {
    const activeCount = todos.filter(t => !t.completed).length;
    itemCount.textContent = `${activeCount} ${activeCount === 1 ? 'item' : 'items'} left`;
}

// Set filter
function setFilter(filter) {
    currentFilter = filter;
    
    // Update active button
    filterButtons.forEach(btn => {
        if (btn.dataset.filter === filter) {
            btn.classList.add('active');
        } else {
            btn.classList.remove('active');
        }
    });
    
    renderTodos();
}

// Event listeners
addBtn.addEventListener('click', addTodo);

todoInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        addTodo();
    }
});

clearCompletedBtn.addEventListener('click', clearCompleted);

filterButtons.forEach(btn => {
    btn.addEventListener('click', () => {
        setFilter(btn.dataset.filter);
    });
});

// Initialize the app
loadTodos();