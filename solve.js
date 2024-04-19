function attachEvents() {
    let loadBoardButton = document.getElementById('load-board-btn');
    loadBoardButton.addEventListener('click', e=>loadBoard());
    let addTaskButton = document.getElementById('create-task-btn');
    addTaskButton.addEventListener('click', e=>createTask());

    let todoTasksList = document.querySelector('#todo-section ul');
    let inProgressTasksList = document.querySelector('#in-progress-section ul');
    let codeReviewTasksList = document.querySelector('#code-review-section ul');
    let doneTasksList = document.querySelector('#done-section ul');


    async function loadBoard(){
        todoTasksList.innerHTML = '';
        inProgressTasksList.innerHTML = '';
        codeReviewTasksList.innerHTML = '';
        doneTasksList.innerHTML = '';
        let fetchedTasks = await (await fetch('http://localhost:3030/jsonstore/tasks/')).json();
        let tasks = Object.values(fetchedTasks);
        for (let task of tasks){
            let listItemElement = document.createElement("li");
            listItemElement.setAttribute("id", task._id);
            listItemElement.classList.add('task');

            let titleElement = document.createElement("h3");
            titleElement.textContent = task.title;
            listItemElement.appendChild(titleElement);

            let descriptionElement = document.createElement("p");
            descriptionElement.textContent = task.description;
            listItemElement.appendChild(descriptionElement);

            let buttonElement = document.createElement("button");
            listItemElement.appendChild(buttonElement);
            buttonElement.addEventListener('click', e=>moveTask(e));

            switch(task.status){
                case "ToDo": 
                    buttonElement.textContent = 'Move to In Progress';
                    todoTasksList.appendChild(listItemElement);
                    break;
                case "In Progress": 
                    buttonElement.textContent = 'Move to Code Review';
                    inProgressTasksList.appendChild(listItemElement);
                    break; 
                case "Code Review": 
                    buttonElement.textContent = 'Move to Done';
                    codeReviewTasksList.appendChild(listItemElement);
                    break; 
                case "Done": 
                    buttonElement.textContent = 'Close';
                    doneTasksList.appendChild(listItemElement);
                    break; 
            }
            console.log(task);
        }
    }

    async function createTask(){
        let taskTitle = document.getElementById('title').value;
        let taskDescription = document.getElementById('description').value;
        if (!taskTitle || !taskDescription){
            return;
        }

        let task = {
            title: taskTitle,
            description: taskDescription,
            status: 'ToDo'
        };

        await fetch('http://localhost:3030/jsonstore/tasks/', {
            method: 'POST',
            body: JSON.stringify(task)
        });
        loadBoard();
        document.getElementById('title').value = null;
        document.getElementById('description').value = null;
    }

    async function moveTask(e){
        const buttonText = e.target.textContent;
        let taskId = e.target.parentNode.getAttribute("id");
        let task = {
            _id: taskId,
            status: ''
        }

        if (buttonText.includes("In Progress")){
            task.status = 'In Progress';
            await fetch(`http://localhost:3030/jsonstore/tasks/${taskId}`, {
                method: 'PATCH',
                body: JSON.stringify(task)
            });
        } else if (buttonText.includes("Code Review")){
            task.status = 'Code Review';
            await fetch(`http://localhost:3030/jsonstore/tasks/${taskId}`, {
                method: 'PATCH',
                body: JSON.stringify(task)
            });
        } else if (buttonText.includes("Done")){
            task.status = 'Done';
            await fetch(`http://localhost:3030/jsonstore/tasks/${taskId}`, {
                method: 'PATCH',
                body: JSON.stringify(task)
            });
        } else if (buttonText.includes("Close")){
            await fetch(`http://localhost:3030/jsonstore/tasks/${taskId}`, {
                method: 'DELETE'
            });
        }

        loadBoard();
    }
}

attachEvents();