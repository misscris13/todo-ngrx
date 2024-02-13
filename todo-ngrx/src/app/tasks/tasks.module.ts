import { StoreModule } from '@ngrx/store';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { taskReducer } from './state/task.reducer';
import { EffectsModule } from '@ngrx/effects';
import { TaskEffects } from './state/task.effects';
import { HttpClientInMemoryWebApiModule } from 'angular-in-memory-web-api';
import { DataService } from '../data.service';

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    StoreModule.forFeature("tasks", taskReducer),
    EffectsModule.forFeature([TaskEffects])
  ],
})
export class TaskModule { }
