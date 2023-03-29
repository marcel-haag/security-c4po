import {Injectable, TemplateRef} from '@angular/core';
import {NbDialogConfig, NbDialogRef, NbDialogService} from '@nebular/theme';
import {ComponentType} from '@angular/cdk/overlay';
import {DialogMessage, SecurityDialogMessage} from '@shared/services/dialog-service/dialog-message';
import {ConfirmDialogComponent} from '@shared/modules/confirm-dialog/confirm-dialog.component';
import {SecurityConfirmDialogComponent} from '@shared/modules/security-confirm-dialog/security-confirm-dialog.component';
import {RetryDialogComponent} from '@shared/modules/retry-dialog/retry-dialog.component';

@Injectable({
  providedIn: 'root'
})
export class DialogService {

  constructor(private dialog: NbDialogService) {
  }

  /**
   * Opens a custom MatDialog
   */
  openCustomDialog<T>(
    componentOrTemplateRef: ComponentType<T> | TemplateRef<T>,
    config?: Partial<NbDialogConfig<Partial<T> | string>>
  ): NbDialogRef<T> {
    return this.dialog.open<T>(componentOrTemplateRef, {
      context: config?.context || undefined,
      closeOnEsc: config?.closeOnEsc || false,
      hasScroll: config?.hasScroll || false,
      autoFocus: config?.autoFocus || true,
      closeOnBackdropClick: config?.closeOnBackdropClick || false
    });
  }

  /**
   * @param message.key The translation key for the shown message
   * @param message.data The data that may be used in the message translation key (Set it null if it's not required in the key)
   * @param message.title The translation key for the dialog title
   */
  openConfirmDialog(message: DialogMessage): NbDialogRef<ConfirmDialogComponent> {
    return this.dialog.open(ConfirmDialogComponent, {
      closeOnEsc: true,
      hasScroll: false,
      autoFocus: true,
      closeOnBackdropClick: false,
      context: {data: message}
    });
  }

  /**
   * @param message.key The translation key for the shown message
   * @param message.data The data that may be used in the message translation key (Set it null if it's not required in the key)
   * @param message.title The translation key for the dialog title
   */
  openRetryDialog(message: DialogMessage): NbDialogRef<RetryDialogComponent> {
    return this.dialog.open(RetryDialogComponent, {
      closeOnEsc: true,
      hasScroll: false,
      autoFocus: true,
      closeOnBackdropClick: false,
      context: {data: message}
    });
  }

  /**
   * @param message.key The translation key for the shown message
   * @param message.data The data that may be used in the message translation key (Set it null if it's not required in the key)
   * @param message.title The translation key for the dialog title
   */
  // ToDo: Implement later on..
  /*openConfirmCheckBoxDialog(message: DialogMessage): NbDialogRef<any> {
    return this.dialog.open(undefined, {
      closeOnEsc: true,
      hasScroll: false,
      autoFocus: true,
      closeOnBackdropClick: false,
      context: {data: message}
    });
  }*/

  /**
   * @param message.key The translation key for the shown message
   * @param message.confirmString The string to be entered for confirmation
   * @param message.data The data that may be used in the message translation key (Set it null if it's not required in the key)
   * @param message.title The translation key for the dialog title
   */
  openSecurityConfirmDialog(message: SecurityDialogMessage): NbDialogRef<SecurityConfirmDialogComponent> {
    return this.dialog.open(SecurityConfirmDialogComponent, {
      closeOnEsc: false,
      hasScroll: false,
      autoFocus: true,
      closeOnBackdropClick: false,
      context: {data: message}
    });
  }
}
