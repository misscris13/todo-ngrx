import { createAction, props } from "@ngrx/store";
import { Task } from "../task";

export const loadTasks = createAction(
  "[Task] Load"
);

export const loadTasksSuccess = createAction(
  "[Task] Load Success",
  props<{ tasks: Task[] }>()
);

export const loadTasksFail = createAction(
  "[Task] Load Fail",
  props<{ error: string }>()
);

export const updateTask = createAction(
  "[Task] Update",
  props<{ task: Task }>()
);

export const updateTaskSuccess = createAction(
  "[Task] Update Task Success",
  props<{ task: Task }>()
);

export const updateTaskFail = createAction(
  "[Task] Update Task Fail",
  props<{ error: string}>()
);
