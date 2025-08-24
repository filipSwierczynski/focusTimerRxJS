import { Injectable } from "@angular/core";
import { Task } from "../models/task.model";
import { BehaviorSubject, Observable } from "rxjs";
import { loadFromLocalStorage, saveToStorage } from "../shared/persistent";

const STORAGE_KEY = 'tasks_v1';

function uuid(): string {
  return crypto?.randomUUID?.() ?? Math.random().toString(36).slice(2) + Date.now().toString(36);
}

@Injectable({ providedIn: 'root'})
export class TasksService {
    private readonly _tasks$ = new BehaviorSubject<Task[]>(loadFromLocalStorage<Task[]>(STORAGE_KEY, []));
    readonly tasks$: Observable<Task[]> = this._tasks$.asObservable();
    private setTasks(next: Task[]){
        this._tasks$.next(next);
        saveToStorage(STORAGE_KEY, next);
    }

    add(title: string){
        const now = Date.now();
        const t: Task = { id: uuid(), title: title.trim(), done: false,createdAt:now, updatedAt:now};
        this.setTasks([t, ...this._tasks$.value])
    }

    toggle(id: string){
        const now = Date.now();
        this.setTasks(
            this._tasks$.value.map(t => t.id === id ? { ...t, done: !t.done, updatedAt: now} : t)
        )
    }

    rename(id: string, title:string){
        const now = Date.now();
        this.setTasks(
            this._tasks$.value.map(t => t.id === id ? {...t, title: title.trim(), updatedAt: now}: t)
        )
    }

    remove(id: string){
        this.setTasks(this._tasks$.value.filter(t => t.id !== id))
    }

    clearCompleted(){
    this.setTasks(this._tasks$.value.filter(t => !t.done));

    }
}
