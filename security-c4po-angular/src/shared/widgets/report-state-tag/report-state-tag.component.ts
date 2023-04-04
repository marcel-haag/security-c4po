import {ChangeDetectionStrategy, Component, Input, OnChanges, OnInit} from '@angular/core';
import {ReportState, ReportStateText, reportStateTexts} from '@shared/models/state.enum';
import {Severity} from '@shared/models/severity.enum';

@Component({
  selector: 'app-report-state-tag',
  templateUrl: './report-state-tag.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ReportStateTagComponent implements OnChanges {

  @Input() currentReportState: ReportState = ReportState.NEW;

  // HTML only
  state = ReportState;
  reportState: any = 0;
  readonly reportStateTexts: Array<ReportStateText> = reportStateTexts;

  constructor() { }

  ngOnChanges(): void {
    this.reportState = typeof this.currentReportState !== 'number' ? ReportState[this.currentReportState] : this.currentReportState;
  }

  getTranslationKey(): string {
    const index = this.reportStateTexts.findIndex(statusText => statusText.value === this.reportState);
    return this.reportStateTexts[index].translationText;
  }
}
