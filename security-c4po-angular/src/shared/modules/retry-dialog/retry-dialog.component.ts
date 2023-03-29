import {Component, Input} from '@angular/core';
import {NbDialogRef} from '@nebular/theme';
import * as FA from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-retry-dialog',
  templateUrl: './retry-dialog.component.html',
  styleUrls: ['./retry-dialog.component.scss']
})
export class RetryDialogComponent {
  /**
   * @param data contains all relevant information the dialog needs
   * @param data.title The translation key for the dialog title
   * @param data.key The translation key for the shown message
   * @param data.data The data that may be used in the message translation key
   */
  @Input() data: any;
  // HTML only
  readonly fa = FA;

  constructor(protected dialogRef: NbDialogRef<any>) {
  }

  onClickRetry(): void {
    this.dialogRef.close({retry: true});
  }

  onClickCancel(): void {
    this.dialogRef.close({retry: false});
  }
}
