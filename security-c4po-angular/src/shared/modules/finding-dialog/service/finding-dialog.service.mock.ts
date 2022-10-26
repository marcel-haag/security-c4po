import {ComponentType} from '@angular/cdk/overlay';
import {NbDialogConfig} from '@nebular/theme';
import {Observable, of} from 'rxjs';
import {FindingDialogService} from '@shared/modules/finding-dialog/service/finding-dialog.service';
import {Finding} from '@shared/models/finding.model';

export class FindingDialogServiceMock implements Required<FindingDialogService> {

  dialog: any;

  openFindingDialog(
    componentOrTemplateRef: ComponentType<any>,
    finding: Finding | undefined,
    config: Partial<NbDialogConfig<Partial<any> | string>> | undefined): Observable<any> {
    return of(undefined);
  }
}
