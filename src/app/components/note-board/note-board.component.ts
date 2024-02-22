import { CdkDragDrop, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';
import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Task } from '../../models/task.model';

@Component({
  selector: 'app-note-board',
  templateUrl: './note-board.component.html',
  styleUrls: ['./note-board.component.scss']
})
export class NoteBoardComponent implements OnInit {

  todoForm!: FormGroup;
  tasks: Task[] = [];
  inProgress: Task[] = [];
  done: Task[] = [];
  updateIndex!: any;
  isEditEnabled: boolean = false;

  constructor(private fb: FormBuilder) {}

  ngOnInit(): void {
    this.todoForm = this.fb.group({
      item: ['', Validators.required]
    });

    const storedTasks = localStorage.getItem('tasks');
    if (storedTasks) {
      const parsedTasks = JSON.parse(storedTasks);
      this.tasks = parsedTasks.tasks || [];
      this.inProgress = parsedTasks.inProgress || [];
      this.done = parsedTasks.done || [];
    }
  }

  addTask(){
    const newTask: Task = {
      description: this.todoForm.value.item,
      done: false
    };
    this.tasks.push(newTask);
    this.todoForm.reset();
    this.updateLocalStorage();
  }

  editTask(item: Task, i: number){
    this.todoForm.controls['item'].setValue(item.description);
    this.updateIndex = i;
    this.isEditEnabled = true;
  }

  updateTask(){
    this.tasks[this.updateIndex].description = this.todoForm.value.item;
    this.tasks[this.updateIndex].done = false;
    this.todoForm.reset();
    this.updateIndex = undefined;
    this.isEditEnabled = false;
    this.updateLocalStorage();
  }

  deleteTask(i: number){
    this.tasks.splice(i,1);
    this.updateLocalStorage();
  }

  deleteTaskInProgress(i: number){
    this.inProgress.splice(i,1);
    this.updateLocalStorage();
  }

  deleteTaskDone(i: number){
    this.done.splice(i,1);
    this.updateLocalStorage();
  }

  drop(event: CdkDragDrop<Task[]>, category: string) {
    let targetArray: Task[];

    switch (category) {
      case 'tasks':
        targetArray = this.tasks;
        break;
      case 'inProgress':
        targetArray = this.inProgress;
        break;
      case 'done':
        targetArray = this.done;
        break;
      default:
        return;
    }

    if (event.previousContainer === event.container) {
      moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
    } else {
      transferArrayItem(
        event.previousContainer.data,
        targetArray,
        event.previousIndex,
        event.currentIndex,
      );
    }

    this.updateLocalStorage();
  }

  private updateLocalStorage() {
    const tasksObj = {
      tasks: this.tasks,
      inProgress: this.inProgress,
      done: this.done
    };
    localStorage.setItem('tasks', JSON.stringify(tasksObj));
  }
}
