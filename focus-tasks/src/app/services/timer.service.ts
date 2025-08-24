import { Injectable, OnDestroy } from '@angular/core';
import { loadFromLocalStorage, saveToStorage, todayKey } from '../shared/persistent';
import { EMPTY, interval, map, scan, shareReplay, startWith, Subject, switchMap, tap } from 'rxjs';

export type TimerStatus = 'idle' | 'running' | 'paused';

export interface TimerState {
  durationSec: number;
  remainingSec: number;
  status: TimerStatus;
  statsToday: { date: string; focusedSec: number; sessions: number };
}

export type TimerEvent =
  | { type: 'setDuration'; sec: number }
  | { type: 'start' }
  | { type: 'pause' }
  | { type: 'reset' }
  | { type: 'tick' }
  | { type: '__init__' };

const STORAGE_KEY = 'timer_prefs_v1';

export const initialTimerState = (): TimerState => {
  const persisted = loadFromLocalStorage<{ durationSec: number } | null>(STORAGE_KEY, null);
  const dur = persisted?.durationSec ?? 25 * 60;
  const key = todayKey();
  return {
    durationSec: dur,
    remainingSec: dur,
    status: 'idle',
    statsToday: { date: key, focusedSec: 0, sessions: 0 },
  };
};

export function reduceTimer(state: TimerState, ev: TimerEvent): TimerState {
  // Rollower daily stats if date changed
  const today = todayKey();
  if (state.statsToday.date !== today) {
    state = { ...state, statsToday: { date: today, focusedSec: 0, sessions: 0 } };
  }

  switch (ev.type) {
    case '__init__':
      return state;

    case 'setDuration': {
      const nextDur = Math.max(1, Math.floor(ev.sec));
      const isRunning = state.status == 'running';
      return {
        ...state,
        durationSec: nextDur,
        remainingSec: isRunning ? state.remainingSec : nextDur,
      };
    }

    case 'start': {
 if (state.status == 'running') return state;
      const remaining = state.remainingSec > 0 ? state.remainingSec : state.durationSec;
      return { ...state, status: 'running', remainingSec: remaining };
    }
     

    case 'pause': {
if (state.status != 'running') return state;
      return { ...state, status: 'paused' };
    }

    case 'reset': {
        return {...state, status:'idle', remainingSec: state.durationSec}
    }

    case 'tick': {
        if (state.status !== 'running') return state;
        const next = Math.max(0, state.remainingSec - 1);
        const completed = next == 0 && state.remainingSec > 0;
        return {
            ...state,
            remainingSec: next,
            status: completed ? 'idle' : state.status,
            statsToday: {
                date:state.statsToday.date,
                focusedSec: state.statsToday.focusedSec + 1,
                sessions: state.statsToday.sessions + (completed ? 1 : 0)
            },
        };
    }
      
  }
}

@Injectable({providedIn: 'root'})
export class TimerService implements OnDestroy {
    private readonly events$ = new Subject<TimerEvent>();

    readonly state$ = this.events$.pipe(
        startWith({type: '__init__'} as TimerEvent),
        scan(reduceTimer, initialTimerState()),
        tap(s => saveToStorage(STORAGE_KEY, { durationSec: s.durationSec})),
        shareReplay({bufferSize: 1, refCount: true})
    );

    private readonly tickSub = this.state$.pipe(
        switchMap((s) => (s.status === 'running' ? interval(1000) : EMPTY)),
        map(() => ({type: 'tick'} as TimerEvent))
    ).subscribe((e) => this.events$.next(e));

    setDuration(mins: number) {
        this.events$.next({type: 'setDuration', sec: Math.floor(mins * 60)});
    }
    start(){
        this.events$.next({type:'start'})
    }
    pause() {
        this.events$.next({type:'pause'})
    }
    reset() {
        this.events$.next({type:'reset'})
    }

    ngOnDestroy(): void {
        this.tickSub.unsubscribe();
    }
}
