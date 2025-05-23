import durationPlugin from 'dayjs/plugin/duration';
import relativeTimePlugin from 'dayjs/plugin/relativeTime';
import utcPlugin from 'dayjs/plugin/utc';
import dayjs from 'dayjs';
import 'dayjs/locale/he';
dayjs.locale('he')
dayjs.extend(durationPlugin);
dayjs.extend(relativeTimePlugin);
dayjs.extend(utcPlugin);

export class Format {
  
  static dayjs = dayjs;

  public number(value: number): string {
    if (value) {
      let fracDigits = 0;
      if (value < 1000 && value > -1000) {
        fracDigits = 2;
      }
      return value.toLocaleString(
        'en-US', {
          style: 'decimal',
          maximumFractionDigits: fracDigits
        });
    } else {
      return '-';
    }
  }

  public ils(value: number): string {
    return '₪' + this.number(value);
  }

  public date(value: string): string {
    return dayjs(value).format('DD/MM/YYYY');
  }

  public relativeDate(value: string|null|undefined, noVal?: string): string {
    if (value) {
      return dayjs(value).fromNow();
    }
    return noVal || 'תאריך פרסום לא ידוע';
  }

  public relativeUTCDate(value: string|null|undefined, noVal?: string): string {
    if (value) {
      return dayjs.utc(value).fromNow();
    }
    return noVal || 'לא ידוע';
  }

  public percent(value: number): string {
    if (value >= 0) {
      value = value * 100;
      value = Math.ceil(value);
      return value.toFixed(0) + '%';
    } else {
      return '?%';
    }
  }

  public niceCode(code: string) {
    let ret = '';
    code = code.slice(2);
    while (code.length > 0) {
      ret += code.substring(0, 2);
      code = code.substring(2);
      if (code.length > 0) {
        ret += '.';
      }
    }
    return ret;
  }
  
}