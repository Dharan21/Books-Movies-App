import { PipeTransform, Pipe } from '@angular/core';

@Pipe({
  name: 'sLength'
})
export class StringLength implements PipeTransform {
  transform(value: string, length: number) {
    if (value.length > length) {
      return value.slice(0, length) + ' ...';
    }
    return value;
  }
}
