import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'stateCount',
  standalone: true,
})
export class StateCountPipe implements PipeTransform {
  transform(list: any[], state: string): number {
    if (!list) return 0;
    return list.filter(item => item.estado === state).length;
  }
}
