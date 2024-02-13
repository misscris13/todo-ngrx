import { NgModule } from "@angular/core";
import { StoreModule } from "@ngrx/store";
import { StoreDevtoolsModule } from "@ngrx/store-devtools";
import { EffectsModule } from "@ngrx/effects";
import { DataService } from "./data.service";
import { HttpClientModule } from "@angular/common/http";

@NgModule({
  imports: [
    // HttpClientInMemoryWebApiModule.forRoot(DataService),
    HttpClientModule,
    StoreModule.forRoot({}),
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
