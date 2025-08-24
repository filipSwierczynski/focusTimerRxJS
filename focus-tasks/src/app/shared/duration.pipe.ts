import {Pipe, PipeTransform } from '@angular/core'

@Pipe({ name: 'mmss', standalone:true})
export class DurationPipe implements PipeTransform {
    transform(totalSeconds: number | null | undefined): string {
        const s = Math.max(0, Math.floor(totalSeconds ?? 0));
        const mm = Math.floor(s/60).toString().padStart(2, '0');
        const ss = (s % 60).toString().padStart(2, '0');
        return `${mm}:${ss}`;
    }
}