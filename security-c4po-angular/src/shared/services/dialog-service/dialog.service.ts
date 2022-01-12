import {Injectable, TemplateRef} from '@angular/core';
import {NbDialogConfig, NbDialogRef, NbDialogService} from '@nebular/theme';
import {ComponentType} from '@angular/cdk/overlay';

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
      autoFocus: config?.autoFocus || false,
      closeOnBackdropClick: config?.closeOnBackdropClick || false,
    });
  }
}
