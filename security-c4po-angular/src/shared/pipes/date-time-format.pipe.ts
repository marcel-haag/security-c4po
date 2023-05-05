import {Pipe, PipeTransform} from '@angular/core';
import {formatDate} from '@angular/common';
import {Store} from '@ngxs/store';
import {CustomPipe} from '@shared/models/custom-pipe.mode';
import {TranslateService} from '@ngx-translate/core';

@Pipe({
  name: 'dateTimeFormat',
  pure: false
})
export class DateTimeFormatPipe implements PipeTransform {

  constructor(private store: Store, private translateService: TranslateService) {
  }

  /**
   * Transforms the value to the appropriate date and time format according to the selected number and date format
   * @param value of type any
   * @return formatted value as string
   */
  transform(value: any): string {
    if (!value) {
      return '-';
    }

    const currentLanguage = this.translateService.currentLang;

    if (!currentLanguage) {
      return formatDate(value, CustomPipe.DATE_TIME_FMT_EN, 'en-US');
    }
    if (currentLanguage === 'de-DE') {
      return formatDate(value, CustomPipe.DATE_TIME_FMT_DE, currentLanguage) + ' Uhr';
    }
    // @ts-ignore
    return formatDate(value, CustomPipe.DATE_TIME_FMT_EN, currentLanguage);
  }
}
