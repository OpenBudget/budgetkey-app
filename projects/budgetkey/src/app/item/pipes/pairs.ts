import {Pipe, PipeTransform} from '@angular/core';

@Pipe({name: 'pairs'})
export class PairsPipe implements PipeTransform {
  transform(value: any = {}): any[] {
    return Object.keys(value).map((key) => [key, value[key]]);
  }
}
