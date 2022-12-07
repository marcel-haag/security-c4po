import {Injectable} from '@angular/core';
import {NbDialogConfig, NbDialogService} from '@nebular/theme';
import {GenericDialogData} from '@shared/models/generic-dialog-data';
import {ComponentType} from '@angular/cdk/overlay';
import {Observable} from 'rxjs';
import {Validators} from '@angular/forms';
import {FindingDialogComponent} from '@shared/modules/finding-dialog/finding-dialog.component';
import {Finding} from '@shared/models/finding.model';
import {Severity} from '@shared/models/severity.enum';

@Injectable()
export class FindingDialogService {

  constructor(private readonly dialog: NbDialogService) {
  }

  private readonly MIN_LENGTH: number = 4;

  static addDataToDialogConfig(
    dialogOptions?: Partial<NbDialogConfig<Partial<any> | string>>,
    findingData?: GenericDialogData
  ): Partial<NbDialogConfig<Partial<any> | string>> {
    return {
      context: {data: findingData},
      closeOnEsc: dialogOptions?.closeOnEsc || false,
      hasScroll: dialogOptions?.hasScroll || false,
      autoFocus: dialogOptions?.autoFocus || false,
      closeOnBackdropClick: dialogOptions?.closeOnBackdropClick || false
    };
  }

  public openFindingDialog(componentOrTemplateRef: ComponentType<any>,
                           finding?: Finding,
                           config?: Partial<NbDialogConfig<Partial<any> | string>>): Observable<any> {
    let dialogOptions: Partial<NbDialogConfig<Partial<any> | string>>;
    let dialogData: GenericDialogData;
    let severity;
    // transform severity of finding if existing
    if (finding) {
      severity = typeof finding.severity !== 'number' ? Severity[finding.severity] : finding.severity;
    }
    // Setup FindingDialogBody
    dialogData = {
      form: {
        findingTitle: {
          fieldName: 'findingTitle',
          type: 'formText',
          labelKey: 'finding.title.label',
          placeholder: 'finding.title',
          controlsConfig: [
            {value: finding ? finding.title : '', disabled: false},
            [Validators.required]
          ],
          errors: [
            {errorCode: 'required', translationKey: 'finding.validationMessage.titleRequired'}
          ]
        },
        findingSeverity: {
          fieldName: 'findingSeverity',
          type: 'severity-select',
          labelKey: 'finding.severity.label',
          placeholder: 'finding.severity',
          controlsConfig: [
            {value: finding ? severity : Severity.LOW, disabled: false},
            [Validators.required]
          ],
          errors: [
            {errorCode: 'required', translationKey: 'finding.validationMessage.severityRequired'}
          ]
        },
        findingDescription: {
          fieldName: 'findingDescription',
          type: 'formText',
          labelKey: 'finding.description.label',
          placeholder: 'finding.description',
          controlsConfig: [
            {value: finding ? finding.description : '', disabled: false},
            [Validators.required]
          ],
          errors: [
            {errorCode: 'required', translationKey: 'finding.validationMessage.descriptionRequired'}
          ]
        },
        findingImpact: {
          fieldName: 'findingImpact',
          type: 'formText',
          labelKey: 'finding.impact.label',
          placeholder: 'finding.impact',
          controlsConfig: [
            {value: finding ? finding.impact : '', disabled: false},
            [Validators.required]
          ],
          errors: [
            {errorCode: 'required', translationKey: 'finding.validationMessage.impactRequired'}
          ]
        },
        findingAffectedUrls: {
          fieldName: 'findingAffectedUrls',
          type: 'text',
          labelKey: 'finding.affectedUrls.label',
          placeholder: 'finding.affectedUrls.placeholder',
          controlsConfig: [
            {value: finding ? finding.affectedUrls : [], disabled: false},
            []
          ],
          errors: [
            {errorCode: 'required', translationKey: 'finding.validationMessage.affectedUrlsRequired'}
          ]
        },
        findingReproduction: {
          fieldName: 'findingReproduction',
          type: 'text',
          labelKey: 'finding.reproduction.label',
          placeholder: 'finding.reproduction',
          controlsConfig: [
            {value: finding ? finding.reproduction : '', disabled: false},
            [Validators.required]
          ],
          errors: [
            {errorCode: 'required', translationKey: 'finding.validationMessage.reproductionRequired'}
          ]
        },
        findingMitigation: {
          fieldName: 'findingMitigation',
          type: 'text',
          labelKey: 'finding.mitigation.label',
          placeholder: 'finding.mitigation',
          controlsConfig: [
            {value: finding ? finding.mitigation : '', disabled: false},
            []
          ],
          errors: [
            {errorCode: 'required', translationKey: 'finding.validationMessage.mitigationRequired'}
          ]
        }
      },
      options: []
    };
    if (finding) {
      dialogData.options = [
        {
          headerLabelKey: 'finding.edit.header',
          buttonKey: 'global.action.update',
          accentColor: 'warning'
        },
      ];
    } else {
      dialogData.options = [
        {
          headerLabelKey: 'finding.create.header',
          buttonKey: 'global.action.save',
          accentColor: 'info'
        },
      ];
    }
    // Merge dialog config with finding data
    dialogOptions = FindingDialogService.addDataToDialogConfig(config, dialogData);
    return this.dialog.open(FindingDialogComponent, dialogOptions).onClose;
  }
}
