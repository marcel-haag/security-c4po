import {NotificationService, PopupType} from './notification.service';

export class NotificationServiceMock implements Required<NotificationService> {
  public showPopup(translationKey: string, popupType?: PopupType): void {
  }
}
