import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'duration',
})
export class DurationPipe implements PipeTransform {
  transform(minutes: number | null | undefined): string {
    if (!minutes) {
      return '';
    }

    const hours = Math.floor(minutes / 60);
    const rest = minutes % 60;

    if (hours === 0) {
      return `${rest}min`;
    }
    if (rest === 0) {
      return `${hours}h`;
    }
    return `${hours}h ${rest}min`;
  }
}
