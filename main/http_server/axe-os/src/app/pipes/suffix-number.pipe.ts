import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'suffixNumber'
})
export class SuffixNumberPipe implements PipeTransform {
  transform(value: number, sigdigits?: number): string {
    if (value == null) {
      return '';
    }

    const KILO = 1_000;
    const MEGA = 1_000_000;
    const GIGA = 1_000_000_000;
    const TERA = 1_000_000_000_000;
    const PETA = 1_000_000_000_000_000;
    const EXA  = 1_000_000_000_000_000_000n;

    let suffix = '';
    let dval: number;
    let decimal = true;

    if (value >= EXA) {
      dval = Math.floor(value / PETA) / 1000;
      suffix = 'E';
    } else if (value >= PETA) {
      dval = Math.floor(value / TERA) / 1000;
      suffix = 'P';
    } else if (value >= TERA) {
      dval = Math.floor(value / GIGA) / 1000;
      suffix = 'T';
    } else if (value >= GIGA) {
      dval = Math.floor(value / MEGA) / 1000;
      suffix = 'G';
    } else if (value >= MEGA) {
      dval = Math.floor(value / KILO) / 1000;
      suffix = 'M';
    } else if (value >= KILO) {
      dval = value / 1000;
      suffix = 'k';
    } else {
      dval = value;
      decimal = false;
    }

    let result: string;
    if (!sigdigits || sigdigits <= 0) {
      if (decimal) {
        result = parseFloat(dval.toPrecision(3)).toString() + suffix;
      } else {
        result = Math.floor(dval).toString() + suffix;
      }
    } else {
      let ndigits = 0;
      if (dval > 0) {
        ndigits = sigdigits - 1 - Math.floor(Math.log10(dval));
        ndigits = Math.max(ndigits, 0);
      }
      result = dval.toFixed(ndigits) + suffix;
    }

    return result;
  }
}
