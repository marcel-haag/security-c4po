import {ChangeDetectionStrategy, Component, Input, OnInit} from '@angular/core';
import {PentestStatus} from '@shared/models/pentest-status.model';

@Component({
  selector: 'app-status-tag',
  templateUrl: './status-tag.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class StatusTagComponent implements OnInit {
  @Input() currentStatus: PentestStatus = PentestStatus.NOT_STARTED;

  // HTML only
  status = PentestStatus;
  readonly statusTexts: Array<StatusText> = [
    {value: PentestStatus.NOT_STARTED, translationText: 'pentest.statusText.not_started'},
    {value: PentestStatus.DISABLED, translationText: 'pentest.statusText.disabled'},
    {value: PentestStatus.OPEN, translationText: 'pentest.statusText.open'},
    {value: PentestStatus.IN_PROGRESS, translationText: 'pentest.statusText.in_progress'},
    {value: PentestStatus.COMPLETED, translationText: 'pentest.statusText.completed'}
  ];

  constructor() { }

  ngOnInit(): void {
  }

  getTranslationKey(): string {
    const index = this.statusTexts.findIndex(statusText => statusText.value === this.currentStatus);
    return this.statusTexts[index].translationText;
  }
}

export interface StatusText {
  value: string;
  translationText: string;
}
