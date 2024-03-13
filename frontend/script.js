document.addEventListener("DOMContentLoaded", function () {
    const taskForm = document.getElementById("taskForm");
    const taskInput = document.getElementById("taskInput");
    const taskList = document.getElementById("taskList");
    const completedList = document.getElementById("completedList");

    taskForm.addEventListener("submit", function (e) {
        e.preventDefault();
        addTask(taskInput.value);
        taskInput.value = "";
    });

    taskList.addEventListener("click", function (e) {
        handleTaskEvent(e);
    });

    completedList.addEventListener("click", function (e) {
        handleTaskEvent(e);
    });

    function handleTaskEvent(e) {
        e.preventDefault();
        if (e.target.tagName === "BUTTON") {
            const taskItem = e.target.parentElement;
            const taskId = taskItem.dataset.id;
            deleteTask(taskId);
        } else if (e.target.tagName === "INPUT" && e.target.type === "checkbox") {
            const taskItem = e.target.parentElement;
            const taskId = taskItem.dataset.id;
            toggleTaskCompleted(taskId, e.target.checked);
        }
    }

    function addTask(taskText) {
        fetch('http://localhost:8000/tasks/', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ text: taskText }),
        })
            .then(response => response.json())
            .then(data => {
                console.log(data);
                loadTasks();
            })
            .catch(error => {
                console.error('Error:', error);
            });
    }

    function toggleTaskCompleted(taskId, completed) {
        fetch(`http://localhost:8000/tasks/${taskId}/`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ completed: completed }),
        })
            .then(response => response.json())
            .then(data => {
                console.log(data);
                loadTasks();
            })
            .catch(error => {
                console.error('Error:', error);
            });
    }

    function deleteTask(taskId) {
        fetch(`http://localhost:8000/tasks/${taskId}/`, {
            method: 'DELETE',
        })
            .then(response => response.json())
            .then(data => {
                console.log(data);
                loadTasks();
            })
            .catch(error => {
                console.error('Error:', error);
            });
    }

    function loadTasks() {
        fetch('http://localhost:8000/tasks/')
            .then(response => response.json())
            .then(tasks => {
                taskList.innerHTML = '';
                completedList.innerHTML = '';
                tasks.forEach(task => {
                    const li = document.createElement("li");
                    li.dataset.id = task.id;
                    const checkBox = document.createElement("input");
                    checkBox.type = "checkbox";
                    checkBox.checked = task.completed;
                    const taskTextElement = document.createElement("span");
                    taskTextElement.textContent = task.text;
                    const deleteButton = document.createElement("button");
                    deleteButton.textContent = 'Delete';
                    li.appendChild(checkBox);
                    li.appendChild(taskTextElement);
                    li.appendChild(deleteButton);
                    if (task.completed) {
                        completedList.appendChild(li);
                    } else {
                        taskList.appendChild(li);
                    }
                });
            })
            .catch(error => {
                console.error('Error:', error);
            });
    }

    loadTasks();
});
