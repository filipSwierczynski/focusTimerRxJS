import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { Timer } from './timer/timer';
import { Stats } from './stats/stats';
import { TaskList } from './task-list/task-list';
@Component({
  selector: 'app-root',
  imports: [CommonModule, Timer, TaskList, Stats],
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App {
  protected readonly title = signal('focus-tasks');
}
