import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, catchError, map, tap, throwError } from 'rxjs';
import { Task } from './task';

@Injectable({
  providedIn: 'root'
})
export class TaskService {

  private tasksUrl = "api/tasks";

  constructor(private http: HttpClient) { }

  getTasks(): Observable<Task[]> {
    return this.http.get<Task[]>(this.tasksUrl)
      .pipe(
        tap(data => console.log("e: " + JSON.stringify(data))),
        // catchError(this.handleError)
      );
  }

  updateTask(task: Task): Observable<Task> {
    const headers = new HttpHeaders({ "Content-Type": "application/json"});
    const url = `${this.tasksUrl}/${task.id}`;

    return this.http.put<Task>(url, task, { headers }).pipe(
      tap(() => console.log("updateTask: " + task.id)),
      map(() => task),
      catchError(this.handleError)
    );
  }

  private handleError(err: any) {
    let errorMessage: string;

    if (err.error instanceof ErrorEvent) {
      errorMessage = `An error occurred: ${err.error.message}`;
    } else {
      errorMessage = `Backend returned code ${err.status}: ${err.body.error}`;
    }

    console.error(err);
    console.log(err.error.message);
    return throwError(errorMessage);
  }
}
