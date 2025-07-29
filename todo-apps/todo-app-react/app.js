const { useState, useEffect } = React;

// TodoItem Component
function TodoItem({ todo, onToggle, onDelete }) {
    return (
        <li className={`todo-item ${todo.completed ? 'completed' : ''}`}>
            <input
                type="checkbox"
                className="todo-checkbox"
                checked={todo.completed}
                onChange={() => onToggle(todo.id)}
            />
            <span className="todo-text">{todo.text}</span>
            <button className="delete-btn" onClick={() => onDelete(todo.id)}>
                ✕
            </button>
        </li>
    );
}

// TodoList Component
function TodoList({ todos, onToggle, onDelete }) {
    if (todos.length === 0) {
        return <div className="empty-state">No todos yet. Add one above!</div>;
    }
    
    return (
        <ul className="todo-list">
            {todos.map(todo => (
                <TodoItem
                    key={todo.id}
                    todo={todo}
                    onToggle={onToggle}
                    onDelete={onDelete}
                />
            ))}
        </ul>
    );
}

// FilterButtons Component
function FilterButtons({ currentFilter, onFilterChange }) {
    const filters = ['all', 'active', 'completed'];
    
    return (
        <div className="filter-section">
            {filters.map(filter => (
                <button
                    key={filter}
                    className={`filter-btn ${currentFilter === filter ? 'active' : ''}`}
                    onClick={() => onFilterChange(filter)}
                >
                    {filter.charAt(0).toUpperCase() + filter.slice(1)}
                </button>
            ))}
        </div>
    );
}

// Main App Component
function App() {
    // State management
    const [todos, setTodos] = useState(() => {
        // Load initial todos from localStorage
        const saved = localStorage.getItem('react-todos');
        try {
            return saved ? JSON.parse(saved) : [];
        } catch (e) {
            return [];
        }
    });
    
    const [inputValue, setInputValue] = useState('');
    const [filter, setFilter] = useState('all');
    
    // Save todos to localStorage whenever they change
    useEffect(() => {
        try {
            localStorage.setItem('react-todos', JSON.stringify(todos));
        } catch (e) {
            console.error('Error saving todos:', e);
        }
    }, [todos]);
    
    // Add new todo
    const addTodo = () => {
        const text = inputValue.trim();
        if (text === '') return;
        
        const newTodo = {
            id: Date.now(),
            text: text,
            completed: false
        };
        
        setTodos([...todos, newTodo]);
        setInputValue('');
    };
    
    // Toggle todo completion
    const toggleTodo = (id) => {
        setTodos(todos.map(todo =>
            todo.id === id ? { ...todo, completed: !todo.completed } : todo
        ));
    };
    
    // Delete todo
    const deleteTodo = (id) => {
        setTodos(todos.filter(todo => todo.id !== id));
    };
    
    // Clear completed todos
    const clearCompleted = () => {
        setTodos(todos.filter(todo => !todo.completed));
    };
    
    // Filter todos
    const getFilteredTodos = () => {
        switch (filter) {
            case 'active':
                return todos.filter(todo => !todo.completed);
            case 'completed':
                return todos.filter(todo => todo.completed);
            default:
                return todos;
        }
    };
    
    // Calculate active count
    const activeCount = todos.filter(todo => !todo.completed).length;
    const completedCount = todos.filter(todo => todo.completed).length;
    
    return (
        <div className="container">
            <h1>React Todo App</h1>
            
            <div className="input-section">
                <input
                    type="text"
                    className="todo-input"
                    placeholder="What needs to be done?"
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && addTodo()}
                />
                <button className="add-btn" onClick={addTodo}>
                    Add
                </button>
            </div>
            
            <FilterButtons
                currentFilter={filter}
                onFilterChange={setFilter}
            />
            
            <TodoList
                todos={getFilteredTodos()}
                onToggle={toggleTodo}
                onDelete={deleteTodo}
            />
            
            <div className="footer">
                <span>{activeCount} {activeCount === 1 ? 'item' : 'items'} left</span>
                {completedCount > 0 && (
                    <button className="clear-completed" onClick={clearCompleted}>
                        Clear completed
                    </button>
                )}
            </div>
        </div>
    );
}

// Render the app
ReactDOM.render(<App />, document.getElementById('root'));