document.addEventListener('DOMContentLoaded', () => {
    const todoInput = document.getElementById('todoInput');
    const dueDateInput = document.getElementById('dueDateInput');
    const addTodoBtn = document.getElementById('addTodoBtn');
    const filterBtn = document.getElementById('filterBtn');
    const deleteAllBtn = document.getElementById('deleteAllBtn');
    const taskList = document.getElementById('taskList');
    const noTaskMessage = document.getElementById('noTaskMessage');

    let todos = JSON.parse(localStorage.getItem('todos')) || []; // Load from local storage

    // Function to save todos to local storage
    const saveTodos = () => {
        localStorage.setItem('todos', JSON.stringify(todos));
    };

    // Function to render tasks
    const renderTasks = (filteredTodos = todos) => {
        taskList.innerHTML = ''; // Clear existing tasks
        if (filteredTodos.length === 0) {
            noTaskMessage.style.display = 'block';
        } else {
            noTaskMessage.style.display = 'none';
            filteredTodos.forEach((todo, index) => {
                const taskItem = document.createElement('div');
                taskItem.classList.add('task-item');
                taskItem.innerHTML = `
                    <span>${todo.task}</span>
                    <span>${todo.dueDate || 'N/A'}</span>
                    <span>${todo.status}</span>
                    <span class="actions">
                        <button class="edit-btn" data-index="${index}">Edit</button>
                        <button class="delete-btn" data-index="${index}">Delete</button>
                    </span>
                `;
                taskList.appendChild(taskItem);
            });
        }
    };

    // Add Todo
    addTodoBtn.addEventListener('click', () => {
        const task = todoInput.value.trim();
        const dueDate = dueDateInput.value.trim();
        if (task) {
            todos.push({ task, dueDate, status: 'Pending' });
            todoInput.value = '';
            dueDateInput.value = '';
            saveTodos();
            renderTasks();
        }
    });

    // Delete and Edit Task
    taskList.addEventListener('click', (e) => {
        const index = e.target.dataset.index;
        if (e.target.classList.contains('delete-btn')) {
            todos.splice(index, 1);
            saveTodos();
            renderTasks();
        } else if (e.target.classList.contains('edit-btn')) {
            const newTodoText = prompt('Edit your task:', todos[index].task);
            if (newTodoText !== null && newTodoText.trim() !== '') {
                todos[index].task = newTodoText.trim();
                saveTodos();
                renderTasks();
            }
        }
    });

    // Filter (Basic example - could be expanded)
    filterBtn.addEventListener('click', () => {
        // For a simple filter, let's just toggle completed/pending
        // You would typically have a dropdown or more elaborate filter options
        const currentFilter = prompt('Filter by status (e.g., "Pending", "Completed"). Leave blank to show all.');
        if (currentFilter === null) return;

        const filtered = todos.filter(todo =>
            currentFilter === '' || todo.status.toLowerCase().includes(currentFilter.toLowerCase())
        );
        renderTasks(filtered);
    });

    // Delete All
    deleteAllBtn.addEventListener('click', () => {
        if (confirm('Are you sure you want to delete all tasks?')) {
            todos = [];
            saveTodos();
            renderTasks();
        }
    });

    // Initial render
    renderTasks();
});