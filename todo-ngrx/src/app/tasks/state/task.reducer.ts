import { createFeatureSelector, createReducer, createSelector, on } from "@ngrx/store";
import { Task } from "../task";
import * as TaskActions from "./task.actions";
import * as AppState from "../../state/app.state";
import { MatSnackBar } from "@angular/material/snack-bar";
import { map } from "rxjs";

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
  showComplete: boolean;
  showIncomplete: boolean;
  titleFilter: string;
}

const initialState: TaskState = {
  tasks: [],
  error: "",
  viewStatus: ViewStatus.Initial,
  showComplete: true,
  showIncomplete: true,
  titleFilter: ""
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

export const getFilteredTasks = createSelector(
  getTaskFeatureState,
  (state) => state.tasks.filter(
    task =>
      ((task.completed === state.showComplete)
      || (task.completed !== state.showIncomplete))
      && (task.name.includes(state.titleFilter))
  )
);

export const getShowComplete = createSelector(
  getTaskFeatureState,
  (state) => state.showComplete
);

export const getShowIncomplete = createSelector(
  getTaskFeatureState,
  (state) => state.showIncomplete
);

export const getTitleFilter = createSelector(
  getTaskFeatureState,
  (state) => state.titleFilter
);


// ----- REDUCER -----
export const taskReducer = createReducer<TaskState>(
  initialState,

  on(TaskActions.loadTasks, (state): TaskState => {
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
      viewStatus: ViewStatus.Loaded
    };
  }),

  on(TaskActions.loadTasksFail, (state, action): TaskState => {
    return {
      ...state,
      tasks: [],
      error: action.error,
      viewStatus: ViewStatus.Loaded
    };
  }),

  on(TaskActions.updateTask, (state): TaskState => {
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
      viewStatus: ViewStatus.Success,
    };
  }),

  on(TaskActions.updateTaskFail, (state, action): TaskState => {
    return {
      ...state,
      error: action.error,
      viewStatus: ViewStatus.Failure
    };
  }),

  on(TaskActions.toggleShowComplete, (state): TaskState => {
    return {
      ...state,
      showComplete: !state.showComplete
    };
  }),

  on(TaskActions.toggleShowIncomplete, (state): TaskState => {
    return {
      ...state,
      showIncomplete: !state.showIncomplete
    };
  }),

  on(TaskActions.updateTitleFilter, (state, action): TaskState => {
    return {
      ...state,
      titleFilter: action.titleFilter
    };
  }),
)
