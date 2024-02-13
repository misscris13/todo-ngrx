import { Injectable } from '@angular/core';
import { InMemoryDbService } from 'angular-in-memory-web-api';

@Injectable({
  providedIn: 'root'
})
export class DataService implements InMemoryDbService {

  constructor() { }

  createDb() {
    return {
      tasks: [
        {
          id: 1,
          name: "Initialize project",
          description: "Create the project and install the dependencies",
          completed: true
        },
        {
          id: 2,
          name: "Build basic to do list",
          description: "Create the list and display the tasks with cards",
          completed: false
        },
        {
          id: 3,
          name: "Add redux for GET",
          description: "Use effects to handle request, success and fail operations",
          completed: false
        },
        {
          id: 4,
          name: "Hand in the project",
          description: "Report project progress",
          completed: false
        }
      ]
    }
  }
}
