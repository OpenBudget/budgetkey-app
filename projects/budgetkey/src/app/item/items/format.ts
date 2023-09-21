import * as dayjs from 'dayjs'

export class Format {
  
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

  public relativeDate(value: string): string {
    if (value) {
      return dayjs(value).fromNow();
    }
    return 'תאריך פרסום לא ידוע';
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
  
}