import { Routes } from '@angular/router';
import { TaskListComponent } from './tasks/task-list/task-list.component';

export const routes: Routes = [
  // { path: "", component: TaskListComponent },
  {
    path: "", loadChildren: () =>
      import("./tasks/tasks.module").then(m => m.TaskModule),
    component: TaskListComponent
  },
];
