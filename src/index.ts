import { v4 as uuid } from 'uuid';
import type { Task } from './Task';

const list = document.querySelector<HTMLUListElement>('#list');
const form = document.querySelector<HTMLFormElement>('#form');
const input = document.querySelector('#input') as HTMLInputElement;

let TaskList: Task[] = ([] = loadTaskList());

TaskList.forEach(addTaskEle);

form?.addEventListener('submit', (e) => {
  e.preventDefault();

  if (input?.value === '' || input?.value === null) return;

  const newTask: Task = {
    id: uuid(),
    title: input?.value,
    completed: false,
    crateAt: new Date(),
  };
  TaskList.unshift(newTask);
  addTaskEle(newTask);

  input.value = '';
});

function addTaskEle(task: Task) {
  const item = document.createElement('li');
  const label = document.createElement('label');
  const checkBox = document.createElement('input');
  const deleteBtn = document.createElement('button') as HTMLButtonElement;
  checkBox.addEventListener('change', () => {
    task.completed = checkBox.checked;
    if (checkBox.checked) {
      label.style.textDecoration = 'line-through';
    } else {
      label.style.textDecoration = 'none';
    }
    saveTask();
  });
  deleteBtn.addEventListener('click', (e: any) => {
    e.preventDefault();
    deleteItem(e.target.id);
    document.getElementById(e.target.id)?.remove();
  });
  checkBox.type = 'checkbox';
  checkBox.checked = task.completed;
  if (checkBox.checked) {
    label.style.textDecoration = 'line-through';
  }
  deleteBtn.setAttribute('class', 'DeleteBtn');
  deleteBtn.setAttribute('id', task.id);
  item.setAttribute('id',task.id)
  label.append(checkBox, task.title, deleteBtn);
  item.append(label);
  list?.append(item);
  saveTask();
}

function saveTask() {
  localStorage.setItem('TASKS', JSON.stringify(TaskList));
}

function deleteItem(id: string) {
  const deleteData:Task[] = TaskList.filter((item) => {
    return !(item.id == id);
  });
  TaskList = deleteData;
  localStorage.setItem('TASKS', JSON.stringify(deleteData));
  loadTaskList();
}

function loadTaskList() {
  const TaskData = localStorage.getItem('TASKS');
  if (TaskData == null) return [];
  return JSON.parse(TaskData);
}
