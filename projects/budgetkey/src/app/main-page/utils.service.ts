import { Injectable } from '@angular/core';

import { VALUE_SCALE, DEFAULT_LOCALE } from './constants';
import { MainPageModule } from './main-page.module';

const suffixes = Object.keys(VALUE_SCALE)
  .map((key: string) => {
    let value = VALUE_SCALE[key];
    return [value, key.trim()] as [number, string];
  })
  .filter(x => !!x)
  .sort((a: [number, string], b: [number, string]) => {
    return b[0] - a[0];
  });


@Injectable()
export class UtilsService {

  constructor() { }

  formatNumber(
    value: number, fractionDigits: number,
    trimTrailingZeros = true, locale: string | null = DEFAULT_LOCALE
  ): string {
    let result = Number(value).toFixed(fractionDigits);
    if (locale) {
      result = Number(result).toLocaleString(locale);
    }
    if (trimTrailingZeros && (result.indexOf('.') !== -1)) {
      result = result.replace(/0+$/, '').replace(/\.$/, '');
    }
    return result;
  }

  formatValue(
    value: number, fractionDigits: number,
    trimTrailingZeros = true, locale: string | null = DEFAULT_LOCALE
  ): string {
    let suffix = '';
    for (let i = 0; i < suffixes.length; i++) {
      if (Math.abs(value) >= suffixes[i][0]) {
        value = value / suffixes[i][0];
        suffix = suffixes[i][1];
        break;
      }
    }

    return this.formatNumber(value, fractionDigits, trimTrailingZeros, locale) +
      (suffix !== '' ? ' ' + suffix : '');
  }

  bareFormatValue(
    value: number, fractionDigits: number,
    trimTrailingZeros = true, locale: string | null = DEFAULT_LOCALE
  ): string {
    for (let i = 0; i < suffixes.length; i++) {
      if (Math.abs(value) >= suffixes[i][0]) {
        value = value / suffixes[i][0];
        break;
      }
    }
    return this.formatNumber(value, fractionDigits, trimTrailingZeros, locale);
  }

  getValueSuffix(value: number): string | null {
    for (let i = 0; i < suffixes.length; i++) {
      if (Math.abs(value) >= suffixes[i][0]) {
        value = value / suffixes[i][0];
        return suffixes[i][1];
      }
    }
    return null;
  }

}
