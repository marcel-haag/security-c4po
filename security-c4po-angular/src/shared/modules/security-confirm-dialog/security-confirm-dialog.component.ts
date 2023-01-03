import {Component, Inject, Input, OnInit} from '@angular/core';
import {NB_DIALOG_CONFIG, NbDialogRef} from '@nebular/theme';
import {FormControl} from '@angular/forms';
import {acceptableInputValidator} from '@shared/modules/security-confirm-dialog/acceptableInputValidator';
import {UntilDestroy} from '@ngneat/until-destroy';
import {SecurityDialogMessage} from '@shared/services/dialog-service/dialog-message';

@Component({
  selector: 'app-security-confirm-dialog',
  templateUrl: './security-confirm-dialog.component.html',
  styleUrls: ['./security-confirm-dialog.component.scss']
})
@UntilDestroy()
export class SecurityConfirmDialogComponent implements OnInit{

  inputCtrl: FormControl;

  constructor(/**
               * @param data contains all relevant information the dialog needs
               * @param data.title The translation key for the dialog title
               * @param data.confirmString The string to confirm the dialog action
               * @param data.key The translation key for the shown message
               * @param data.data The data that may be used in the message translation key
               */
              @Inject(NB_DIALOG_CONFIG) public data: SecurityDialogMessage,
              protected dialogRef: NbDialogRef<any>) {
  }

  ngOnInit(): void {
    // Setup FormControl and custom validator
    this.inputCtrl = new FormControl('', acceptableInputValidator(this.data.confirmString));
  }

  onClickConfirm(): void {
    this.dialogRef.close({confirm: true});
  }

  onClickClose(): void {
    this.dialogRef.close();
  }
}
