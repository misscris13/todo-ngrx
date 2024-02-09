import { NgModule } from "@angular/core";
import { BrowserModule } from "@angular/platform-browser";
import { HttpClientModule } from "@angular/common/http";

import { HttpClientInMemoryWebApiModule } from "angular-in-memory-web-api";
import { TaskData } from "./tasks/task-data";

import { StoreModule } from "@ngrx/store";
import { StoreDevtoolsModule } from "@ngrx/store-devtools";
import { EffectsModule } from "@ngrx/effects";

@NgModule({
  imports: [
    BrowserModule,
    HttpClientModule,
    HttpClientInMemoryWebApiModule.forRoot(TaskData),
    StoreModule.forRoot({}, {}),
    StoreDevtoolsModule.instrument({
      name: "To Do App DevTools",
      maxAge: 25
    }),
    EffectsModule.forRoot([])
  ],
  declarations: [
  ]
})
export class AppModule { }
