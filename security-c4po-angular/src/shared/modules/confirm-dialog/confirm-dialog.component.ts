import {Component, Input} from '@angular/core';
import {NbDialogRef} from '@nebular/theme';

@Component({
  selector: 'app-confirm-dialog',
  templateUrl: './confirm-dialog.component.html',
  styleUrls: ['./confirm-dialog.component.scss']
})
export class ConfirmDialogComponent {
  /**
   * @param data contains all relevant information the dialog needs
   * @param data.title The translation key for the dialog title
   * @param data.key The translation key for the shown message
   * @param data.data The data that may be used in the message translation key
   */
  @Input() data: any;

  constructor(protected dialogRef: NbDialogRef<any>) {
  }

  onClickConfirm(): void {
    this.dialogRef.close({confirm: true});
  }

  onClickClose(): void {
    this.dialogRef.close();
  }
}
