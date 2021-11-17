import {DialogService} from '@shared/services/dialog-service/dialog.service';
import {ComponentType} from '@angular/cdk/overlay';
import {TemplateRef} from '@angular/core';
import {NbDialogConfig, NbDialogRef} from '@nebular/theme';

export class DialogServiceMock implements Required<DialogService> {

  dialog: any;

  openCustomDialog<T, D = any, R = any>(
    componentOrTemplateRef: ComponentType<T> | TemplateRef<T>,
    config?: Partial<NbDialogConfig<Partial<T> | string>>
  ): NbDialogRef<T> {
    return null;
  }
}
