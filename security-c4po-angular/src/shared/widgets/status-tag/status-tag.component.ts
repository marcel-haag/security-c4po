import {ChangeDetectionStrategy, Component, Input, OnInit} from '@angular/core';
import {Status} from '@shared/models/status.model';

@Component({
  selector: 'app-status-tag',
  templateUrl: './status-tag.component.html',
  styleUrls: ['./status-tag.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class StatusTagComponent implements OnInit {
  @Input() currentStatus: Status = Status.NOT_STARTED;

  // HTML only
  status = Status;
  readonly statusTexts: Array<StatusText> = [
    {value: Status.NOT_STARTED, translationText: 'pentest.statusText.not_started'},
    {value: Status.DISABLED, translationText: 'pentest.statusText.disabled'},
    {value: Status.OPEN, translationText: 'pentest.statusText.open'},
    {value: Status.CHECKED, translationText: 'pentest.statusText.checked'},
    {value: Status.REPORTED, translationText: 'pentest.statusText.reported'},
    {value: Status.UNDER_REVIEW, translationText: 'pentest.statusText.under_review'},
    {value: Status.TRIAGED, translationText: 'pentest.statusText.triaged'}
  ];

  constructor() { }

  ngOnInit(): void {
  }

  getTranslationKey(): string {
    const index = this.statusTexts.findIndex(statusText => statusText.value === this.currentStatus);
    return this.statusTexts[index].translationText;
  }

}

interface StatusText {
  value: string;
  translationText: string;
}
