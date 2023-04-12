import {Injectable} from '@angular/core';
import {TranslateService} from '@ngx-translate/core';
import {NbGlobalPhysicalPosition, NbToastrService} from '@nebular/theme';

@Injectable({
  providedIn: 'root'
})
export class NotificationService {

  constructor(private toastrService: NbToastrService,
              private translateService: TranslateService) {
  }

  public showPopup(translationKey: string, popupType: PopupType): void {
    // TODO: Eliminate subscriptions by using flattening operators
    this.translateService.get([popupType, translationKey])
      .subscribe((translationContainer) => {
        this.toastrService.show(
          '',
          translationContainer[translationKey] /*+ ' ' + translationContainer[popupType]*/, {
            position: NbGlobalPhysicalPosition.BOTTOM_RIGHT,
            duration: 5000,
            status: getStatusForPopUpType(popupType),
            toastClass: createCssClassName(popupType)
          });
      });

    function getStatusForPopUpType(popupType): string {
      let toasterStatus;
      switch (popupType) {
        case PopupType.SUCCESS: {
          toasterStatus = 'success';
          break;
        }
        case PopupType.INFO: {
          toasterStatus = 'control';
          break;
        }
        case PopupType.FAILURE: {
          toasterStatus = 'danger';
          break;
        }
        case PopupType.WARNING: {
          toasterStatus = 'warning';
          break;
        }
        default: {
          toasterStatus = 'basic';
          break;
        }
      }
      return toasterStatus;
    }

    function createCssClassName(type: PopupType): string {
      const currentType = type ? type : PopupType.INFO;
      return currentType.toString().replace('.', '-');
    }
  }
}

export enum PopupType {
  SUCCESS = 'popup.success',
  FAILURE = 'popup.failure',
  WARNING = 'popup.warning',
  INFO = 'popup.info'
}
