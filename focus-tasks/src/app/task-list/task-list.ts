import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { TasksService } from '../services/tasks.service';
import { Task } from '../models/task.model';

@Component({
  selector: 'app-task-list',
  imports: [CommonModule,ReactiveFormsModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './task-list.html',
  styleUrl: './task-list.scss'
})
export class TaskList {
  private readonly tasksService = inject(TasksService);
  tasks$ = this.tasksService.tasks$;
  newTitle = new FormControl('', { nonNullable: true});

  trackById(index: number, t:Task): string {
    return t.id
  }
  add(){
    const t = this.newTitle.value.trim();
    if (!t) return;
    this.tasksService.add(t);
    this.newTitle.setValue('');
  }

  toggle(id: string){
    this.tasksService.toggle(id)
  }
  rename(id:string, title:string){
    this.tasksService.rename(id, title);
  }
  remove(id:string){
    this.tasksService.remove(id)
  }
  clearCompleted(){
    this.tasksService.clearCompleted();
  }

}
