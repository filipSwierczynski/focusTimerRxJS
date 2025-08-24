import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { TimerService } from '../services/timer.service';

@Component({
  selector: 'app-stats',
  imports: [CommonModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './stats.html',
  styleUrl: './stats.scss'
})
export class Stats {
  private readonly timerService = inject(TimerService);
  state$ = this.timerService.state$;
}
