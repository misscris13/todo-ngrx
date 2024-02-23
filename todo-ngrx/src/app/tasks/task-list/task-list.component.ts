import { ChangeDetectionStrategy, Component, OnInit, Signal } from '@angular/core';
import { MatListModule } from "@angular/material/list";
import { MatCardModule } from "@angular/material/card";
import { MatIconModule } from "@angular/material/icon";
import { MatSlideToggle } from "@angular/material/slide-toggle";
import { MatSnackBar } from "@angular/material/snack-bar";
import { MatProgressSpinnerModule } from "@angular/material/progress-spinner";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatChipsModule } from '@angular/material/chips';
import { MatInputModule } from "@angular/material/input";
import { MatButtonModule } from '@angular/material/button';
import { MatDrawerMode, MatSidenavModule } from '@angular/material/sidenav';
import { FormBuilder, FormsModule, ReactiveFormsModule  } from '@angular/forms';
import { Store } from '@ngrx/store';
import { Observable, filter, of, skipWhile } from 'rxjs';
import { State, ViewStatus, getError, getFilteredTasks, getShowComplete, getShowIncomplete, getTasks, getViewStatus } from '../state/task.reducer';
import { Task } from '../task';
import { PushPipe } from "@ngrx/component";
import * as TaskActions from "../state/task.actions";
import { CommonModule } from '@angular/common';
import { TaskService } from '../task.service';
import { HttpClientModule } from '@angular/common/http';
import { TaskModule } from '../tasks.module'
import { HostListener } from "@angular/core";

@Component({
  selector: 'app-task-list',
  standalone: true,
  imports: [
    MatListModule,
    MatSlideToggle,
    MatCardModule,
    MatIconModule,
    MatProgressSpinnerModule,
    MatFormFieldModule,
    MatChipsModule,
    MatInputModule,
    MatButtonModule,
    MatSidenavModule,
    ReactiveFormsModule,
    FormsModule,
    PushPipe,
    TaskModule,
    CommonModule
  ],
  templateUrl: './task-list.component.html',
  styleUrl: './task-list.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [HttpClientModule]
})
export class TaskListComponent implements OnInit {
  pageTitle = "Tasks";

  errorMessage$: Observable<string>;

  loading$: Observable<boolean>;
  loaded$: Observable<boolean>;

  tasks: Signal<Task[]> = this.store.selectSignal(getTasks);
  filteredTasks: Signal<Task[]>;

  titleFilter: string = "";
  showComplete: Signal<boolean>;
  showIncomplete: Signal<boolean>;

  sideNavMode: MatDrawerMode = ("side" as MatDrawerMode);
  sideNavOpened: boolean = true;
  sideNavButton: boolean = false;
  screenWidth: number;

  constructor(private store: Store<State>, private taskService: TaskService, private _snackbar: MatSnackBar, private fb: FormBuilder) {}

  ngOnInit(): void {

    this.errorMessage$ = this.store.select(getError);

    this.filteredTasks = this.store.selectSignal(getFilteredTasks);

    this.store.dispatch(TaskActions.loadTasks());

    this.handleViewStatus();

    this.loading$ = of(true);

    this.loaded$ = of(false);

    this.showComplete = this.store.selectSignal(getShowComplete);
    this.showIncomplete = this.store.selectSignal(getShowIncomplete);

    this.onResize();
  }

  @HostListener('window:resize', ['$event'])
  onResize() {
    this.screenWidth = window.innerWidth;

    if (this.screenWidth <= 1000) {
      this.sideNavMode = "over" as MatDrawerMode;
      this.sideNavOpened = false;
      this.sideNavButton = true;
    } else {
      this.sideNavMode = "side" as MatDrawerMode;
      this.sideNavOpened = true;
      this.sideNavButton = false;
    }
  }

  toggleSideNav(): void {
    this.sideNavOpened = !this.sideNavOpened;
  }

  checkChanged(task: Task): void {
    const newTask = { ...task, completed: !task.completed}

    this.store.dispatch(TaskActions.updateTask({ task: newTask }));
  }

  toggleShowComplete(): void {
    this.store.dispatch(TaskActions.toggleShowComplete());

    if (!this.showComplete() && !this.showIncomplete()) {
      this.toggleShowIncomplete();
    }
  }

  toggleShowIncomplete(): void {
    this.store.dispatch(TaskActions.toggleShowIncomplete());

    if (!this.showComplete() && !this.showIncomplete()) {
      this.toggleShowComplete();
    }
  }

  changeTitleFilter(): void {
    this.store.dispatch(TaskActions.updateTitleFilter({ titleFilter: this.titleFilter }));
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
