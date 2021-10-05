import {Pipe, PipeTransform} from '@angular/core';
import {formatDate} from '@angular/common';
import {Store} from '@ngxs/store';
import {SessionState} from '@shared/stores/session-state/session-state';
import {CustomPipe} from '@shared/models/custom-pipe.mode';

@Pipe({
  name: 'dateTimeFormat'
})
export class DateTimeFormatPipe implements PipeTransform {

  constructor(private store: Store) {
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

    const localeDateAndNumberFormat = this.store.selectSnapshot(SessionState.userAccount) ?
      // @ts-ignore
      this.store.selectSnapshot(SessionState.userAccount.interfaceLang) : 'en-US';

    if (!localeDateAndNumberFormat) {
      return formatDate(value, CustomPipe.DATE_TIME_FMT_EN, 'en-US');
    }
    if (localeDateAndNumberFormat === 'de-DE') {
      return formatDate(value, CustomPipe.DATE_TIME_FMT_DE, localeDateAndNumberFormat) + ' Uhr';
    }
    // @ts-ignore
    return formatDate(value, CustomPipe.DATE_TIME_FMT_EN, localeDateAndNumberFormat);
  }

}
