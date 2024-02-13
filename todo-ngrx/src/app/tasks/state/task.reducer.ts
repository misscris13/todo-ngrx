import { createFeatureSelector, createReducer, createSelector, on } from "@ngrx/store";
import { Task } from "../task";
import * as TaskActions from "./task.actions";
import * as AppState from "../../state/app.state";

// ----- STATE -----
export interface State extends AppState.State {
  tasks: TaskState;
}

export interface TaskState {
  tasks: Task[];
  error: string;
}

const initialState: TaskState = {
  tasks: [],
  error: ""
};

// ----- SELECTORS -----
const getTaskFeatureState = createFeatureSelector<TaskState>('tasks');

export const getTasks = createSelector(
  getTaskFeatureState,
  (state) => state.tasks
);

export const getError = createSelector(
  getTaskFeatureState,
  (state) => state.error
);

// ----- REDUCER -----
export const taskReducer = createReducer<TaskState>(
  initialState,
  on(TaskActions.loadTasksSuccess, (state, action): TaskState => {
    return {
      ...state,
      tasks: action.tasks,
      error: "",
    };
  }),

  on(TaskActions.loadTasksFail, (state, action): TaskState => {
    return {
      ...state,
      tasks: [],
      error: action.error,
    };
  }),

  on(TaskActions.updateTaskSuccess, (state, action): TaskState => {
    const updatedTasks = state.tasks.map((item) =>
      action.task.id == item.id ? action.task : item
    );

    return {
      ...state,
      tasks: updatedTasks,
      error: ""
    };
  }),

  on(TaskActions.updateTaskFail, (state, action): TaskState => {
    return {
      ...state,
      error: action.error
    };
  })
)
