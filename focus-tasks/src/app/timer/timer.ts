import { Component, inject } from '@angular/core';
import { TimerService } from '../services/timer.service';
import { FormControl, ReactiveFormsModule} from '@angular/forms'
import { CommonModule } from '@angular/common';
@Component({
  selector: 'app-timer',
  imports: [ReactiveFormsModule, CommonModule
    
  ],
  templateUrl: './timer.html',
  styleUrl: './timer.scss'
})
export class Timer {
private readonly timerService = inject(TimerService);
state$ = this.timerService.state$;

minutes = new FormControl(25, { nonNullable: true});

constructor(){
  this.state$.subscribe(s => {
    const mins = Math.floor(s.durationSec / 60);
    if (this.minutes.value !== mins) this.minutes.setValue(mins, {emitEvent: false});
  })
}

applyMinutes() {
  this.timerService.setDuration(this.minutes.value)
}
start(){
  this.timerService.start();
}
pause(){
  this.timerService.pause();
}
reset(){
  this.timerService.reset();
}
}
