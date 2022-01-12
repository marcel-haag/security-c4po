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
          translationContainer[translationKey] + ' ' + translationContainer[popupType], {
            position: NbGlobalPhysicalPosition.BOTTOM_RIGHT,
            duration: 5000,
            toastClass: createCssClassName(popupType)
          });
      });

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
