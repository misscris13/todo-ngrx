import { createFeatureSelector, createReducer, createSelector, on } from "@ngrx/store";
import { Task } from "../task";
import * as TaskActions from "./task.actions";
import * as AppState from "../../state/app.state";
import { MatSnackBar } from "@angular/material/snack-bar";

export enum ViewStatus {
  Initial = 'INITIAL',
  Loading = 'LOADING',
  Loaded = 'LOADED',
  Success = 'SUCCESS',
  Failure = 'FAILURE'
};

// ----- STATE -----
export interface State extends AppState.State {
  tasks: TaskState;
}

export interface TaskState {
  tasks: Task[];
  error: string;
  viewStatus: ViewStatus;
  // loading: boolean;
  // loaded: boolean;
}

const initialState: TaskState = {
  tasks: [],
  error: "",
  viewStatus: ViewStatus.Initial,
  // loading: true,
  // loaded: false
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

export const getViewStatus = createSelector(
  getTaskFeatureState,
  (state) => state.viewStatus
);

// export const getLoading = createSelector(
//   getTaskFeatureState,
//   (state) => state.loading
// );

// export const getLoaded = createSelector(
//   getTaskFeatureState,
//   (state) => state.loaded
// );

// ----- REDUCER -----
export const taskReducer = createReducer<TaskState>(
  initialState,

  on(TaskActions.loadTasks, (state, action): TaskState => {
    return {
      ...state,
      viewStatus: ViewStatus.Loading
    };
  }),

  on(TaskActions.loadTasksSuccess, (state, action): TaskState => {
    return {
      ...state,
      tasks: action.tasks,
      error: "",
      // loading: false,
      // loaded: true,
      viewStatus: ViewStatus.Loaded
    };
  }),

  on(TaskActions.loadTasksFail, (state, action): TaskState => {
    return {
      ...state,
      tasks: [],
      error: action.error,
      // loading: false,
      // loaded: false
      viewStatus: ViewStatus.Loaded
    };
  }),

  on(TaskActions.updateTask, (state, action): TaskState => {
    return {
      ...state,
      viewStatus: ViewStatus.Loading
    };
  }),

  on(TaskActions.updateTaskSuccess, (state, action): TaskState => {
    const updatedTasks = state.tasks.map((item) =>
      action.task.id == item.id ? action.task : item
    );

    return {
      ...state,
      tasks: updatedTasks,
      error: "",
      // loading: false,
      // loaded: true
      viewStatus: ViewStatus.Success,
    };
  }),

  on(TaskActions.updateTaskFail, (state, action): TaskState => {
    return {
      ...state,
      error: action.error,
      // loading: false,
      // loaded: false
      viewStatus: ViewStatus.Failure
    };
  })
)
