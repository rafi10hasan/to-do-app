//get html element

let incompleted = document.getElementById("incompleted-count");
let incompletedNumber = parseInt(incompleted.innerText);
let completed = document.getElementById("completed-count");
let completedNumber = parseInt(completed.innerText);

const inputField = document.getElementById("input-field");
const outputField = document.getElementById("output-section");
const toastMsg = document.getElementById("toast-msg");

//read the value from localStorage
const getItemFromLocalStorage = () => {
  return localStorage.getItem("mytask") ? JSON.parse(localStorage.getItem("mytask")) : [];
};

//toast msg
const showToast = (msg, textStatus) => {
  toastMsg.innerText = msg;
  toastMsg.classList.add(`toast-${textStatus}`);

  setTimeout(() => {
    toastMsg.innerText = "";
    toastMsg.classList.remove(`toast-${textStatus}`);
  }, 1000);
};

// display current task
const displayTasks = ()=>{
  const tasks = getItemFromLocalStorage();
  tasks.map(task => createTask(task.taskValue,task.taskId,task.isCompleted));
  completedTask()
  incompletedTask()
}

window.addEventListener("DOMContentLoaded", displayTasks);

//add task

const addTask = () => {
  const taskValue = inputField.value;
  const taskId = Date.now().toString();
  let isCompleted = false;
  createTask(taskValue, taskId , isCompleted);
  showToast("Task is added", "success");
  const tasks = getItemFromLocalStorage();
  tasks.push({ taskValue, taskId, isCompleted });
  localStorage.setItem("mytask", JSON.stringify(tasks));
  incompletedTask();
};

// create Task
const createTask = (taskValue, taskId , isCompleted) => {
  const innerElement = document.createElement("div");
  innerElement.classList.add("content");
  innerElement.id = taskId;
  if(taskValue!== ""){
    innerElement.innerHTML = `
    <p class="align">${taskValue}</p>
    <button id = "finish-btn"><i class="fa-regular fa-circle-check"></i></button>
    <button id ="edit-btn"><i class="fa-solid fa-pen-to-square"></i></button>
    <button id ="delete-btn"><i class="fa-solid fa-trash-can"></i></button>
    ${isCompleted === false ? '<span class="incompleted">incompleted</span>' : '<span class="completed">completed</span>'}
    
    `;
    outputField.appendChild(innerElement);
    inputField.value = "";
    inputField.focus();
  }

 else{
  alert("please write something")
 }
  const deleteButton = innerElement.querySelector("#delete-btn");
  deleteButton.addEventListener("click", deleteTask);

  const editButton = innerElement.querySelector("#edit-btn");
  editButton.addEventListener("click", editTaskValue);

  const finishButton = innerElement.querySelector("#finish-btn");
  finishButton.addEventListener("click", finishedTask);
};

//task button and enter button
document.getElementById("task-btn").addEventListener("click", addTask);
document.getElementById("input-field").addEventListener("keypress", function (event) {
  if (event.key === "Enter") {
    event.preventDefault();
    document.getElementById("task-btn").click();
  }
});

//delete task
const deleteTask = (event) => {
  const selectedItem = event.target.parentElement.parentElement;
  outputField.removeChild(selectedItem);
  showToast("task is deleted", "danger");
  if(event.target.parentNode.parentNode.children[4].innerText ==="incompleted"){
   incompletedTask()
  }
  if(event.target.parentNode.parentNode.children[4].innerText ==="completed"){
   completedTask()
  }
  
  let selectedTaskId = event.target.parentNode.parentNode.id
  let tasks = getItemFromLocalStorage();
  tasks = tasks.filter(task => task.taskId !== selectedTaskId);
  localStorage.setItem("mytask",(JSON.stringify(tasks)));
  incompletedTask()
  completedTask()
};



//edit button

const editTaskValue = (event) => {
  let editedText = prompt("enter your edited text");
  if(editedText!==""){
    let selectedText = event.target.parentNode.parentNode.children[0];
    selectedText.innerText = editedText;
    const uniqueId =parseInt(event.target.parentNode.parentNode.id);
    setEditedText(uniqueId,editedText);
    showToast("Text is Edited","edited")
  }
  else{
    alert("please added something")
  }
};

//Finish task
const finishedTask = (event) => {
  event.target.parentNode.parentNode.children[4].innerText = "completed";
  event.target.parentNode.parentNode.children[4].style.background = "rgb(0, 161, 255)";
  event.target.parentNode.parentNode.children[4].style.background =
    "linear-gradient(329deg, rgba(0, 161, 255, 1) 0%, rgba(0, 255, 143, 1) 100%)";
  const uniqueId =parseInt(event.target.parentNode.parentNode.id) 
  setCompletedStatus(uniqueId);
  showToast("Task is Completed","completed")
  completedTask();
  incompletedTask();
};

//count incompleted task
const incompletedTask = () => {
  const tasks = getItemFromLocalStorage();
  let incompletedArray = tasks.filter((task) => task.isCompleted === false);
  incompleted.innerText = incompletedArray.length;
};

//count completed task
const completedTask = () => {
  const tasks = getItemFromLocalStorage();
  let completedArray = tasks.filter((task) => task.isCompleted === true);
  completed.innerText = completedArray.length;
};

//change complete status
const setCompletedStatus = (uniqueId) => {
  const  tasks = getItemFromLocalStorage();
  for(let task of tasks){
    if(parseInt(task.taskId) === uniqueId){
      task.isCompleted = true;
    }
  }
  localStorage.setItem("mytask",JSON.stringify(tasks))
};

//set new edited task
const setEditedText = (uniqueId,editedText) => {
  const  tasks = getItemFromLocalStorage();
  for(let task of tasks){
    if(parseInt(task.taskId) === uniqueId){
      task.taskValue = editedText;
    }
  }
  localStorage.setItem("mytask",JSON.stringify(tasks))
};
