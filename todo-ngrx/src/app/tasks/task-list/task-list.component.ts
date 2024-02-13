import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { MatListModule } from "@angular/material/list";
import { MatCardModule } from "@angular/material/card";
import { MatIconModule } from "@angular/material/icon";
import { MatSlideToggle } from "@angular/material/slide-toggle";
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { State, getError, getTasks } from '../state/task.reducer';
import { Task } from '../task';
import { PushPipe } from "@ngrx/component";
import * as TaskActions from "../state/task.actions";
import { CommonModule } from '@angular/common';
import { TaskService } from '../task.service';
import { HttpClientModule } from '@angular/common/http';
import { TaskModule } from '../tasks.module'

@Component({
  selector: 'app-task-list',
  standalone: true,
  imports: [
    MatListModule,
    MatSlideToggle,
    MatCardModule,
    MatIconModule,
    PushPipe,
    TaskModule,
    CommonModule,
  ],
  templateUrl: './task-list.component.html',
  styleUrl: './task-list.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [HttpClientModule]
})
export class TaskListComponent implements OnInit {
  pageTitle = "Tasks";

  tasks$: Observable<Task[]>;
  tasks: Task[];
  errorMessage$: Observable<string>;

  constructor(private store: Store<State>, private taskService: TaskService) {}

  ngOnInit(): void {

    this.tasks$ = this.store.select(getTasks);

    this.errorMessage$ = this.store.select(getError);

    this.store.dispatch(TaskActions.loadTasks());
  }

  checkChanged(task: Task): void {
    this.store.dispatch(TaskActions.updateTask({ task }));
  }
}
