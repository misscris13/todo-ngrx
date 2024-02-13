import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { MatListModule } from "@angular/material/list";
import { MatCardModule } from "@angular/material/card";
import { MatIconModule } from "@angular/material/icon";
import { MatSlideToggle } from "@angular/material/slide-toggle";
import { MatSnackBar } from "@angular/material/snack-bar";
import { MatProgressSpinnerModule } from "@angular/material/progress-spinner";
import { Store } from '@ngrx/store';
import { Observable, filter, of, skipWhile, take, tap } from 'rxjs';
import { State, ViewStatus, getError, getTasks, getViewStatus } from '../state/task.reducer';
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
    MatProgressSpinnerModule,
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

  loading$: Observable<boolean>;
  loaded$: Observable<boolean>;

  constructor(private store: Store<State>, private taskService: TaskService, private _snackbar: MatSnackBar) {}

  ngOnInit(): void {

    this.tasks$ = this.store.select(getTasks);

    this.errorMessage$ = this.store.select(getError);

    this.store.dispatch(TaskActions.loadTasks());

    this.handleViewStatus();

    this.loading$ = of(true);

    this.loaded$ = of(false);
  }

  checkChanged(task: Task): void {
    this.store.dispatch(TaskActions.updateTask({ task }));
  }

  handleViewStatus(): void {
    const viewStatus$ = this.store.select(getViewStatus).pipe(
      skipWhile(viewStatus => viewStatus !== ViewStatus.Loading));

    const loading$ = viewStatus$.pipe(filter(viewStatus => viewStatus === ViewStatus.Loading));

    loading$.subscribe(() => {
      console.log("loading");
      this.loading$ = of(true);
      this.loaded$ = of(false);
    });

    const loaded$ = viewStatus$.pipe(filter(viewStatus => viewStatus === ViewStatus.Loaded));

    loaded$.subscribe(() => {
      console.log("loaded");
      this.loading$ = of(false);
      this.loaded$ = of(true);
    })

    const success$ = viewStatus$.pipe(filter(viewStatus => viewStatus === ViewStatus.Success));

    success$.subscribe(() => {
      console.log("success");
      this.loading$ = of(false);
      this.loaded$ = of(true);
      this.openSnackbar("Operation successful");
    })

    const failure$ = viewStatus$.pipe(filter(viewStatus => viewStatus === ViewStatus.Failure));

    failure$.subscribe(() => {
      console.log("failure");
      this.loading$ = of(false);
      this.loaded$ = of(true);
      this.openSnackbar("Could not complete operation");
    })
  }

  private openSnackbar(message: string): void {
    this._snackbar.open(message, "Close", {duration: 2000});
  }
}
