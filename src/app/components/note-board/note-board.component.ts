import { CdkDragDrop, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';
import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms'
import { Task } from '../../models/task.model';

@Component({
  selector: 'app-note-board',
  templateUrl: './note-board.component.html',
  styleUrls: ['./note-board.component.scss']
})
export class NoteBoardComponent implements OnInit{

  todoForm!: FormGroup;
  tasks: Task [] = [];
  inProgress: Task[] = [];
  done: Task[] = [];

  constructor(private fb: FormBuilder) {}

  ngOnInit(): void {
    this.todoForm = this.fb.group({
      item: ['', Validators.required]
    })
  }

  addTask(){
    this.tasks.push({
      description: this.todoForm.value.item,
      done:false
    })
  }

  deleteTask(i: number){
    this.tasks.splice(i,1);
  }

  editTask(i: number){
    this.tasks.splice(i,1);
  }

  drop(event: CdkDragDrop<Task[]>) {
    if (event.previousContainer === event.container) {
      moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
    } else {
      transferArrayItem(
        event.previousContainer.data,
        event.container.data,
        event.previousIndex,
        event.currentIndex,
      );
    }
  }

}
