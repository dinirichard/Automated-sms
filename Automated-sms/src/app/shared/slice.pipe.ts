import { Pipe, PipeTransform } from '@angular/core';
import { isArray } from 'util';

@Pipe({
  name: 'slice',
})
export class SlicePipe implements PipeTransform {
  transform(
    value: ReadonlyArray<any>,
    start: number = 0,
    end: number = 1
  ): Array<any> {
    if (!isArray(value)) {
      return value;
    }

    return value.slice(start, end);
  }
}
