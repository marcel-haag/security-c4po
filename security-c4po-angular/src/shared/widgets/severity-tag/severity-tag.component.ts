import {ChangeDetectionStrategy, Component, Input, OnInit} from '@angular/core';
import {Severity} from '@shared/models/severity.enum';

@Component({
  selector: 'app-severity-tag',
  templateUrl: './severity-tag.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SeverityTagComponent implements OnInit {

  @Input() currentSeverity: Severity = Severity.LOW;

  // HTML only
  severity = Severity;
  readonly severityTexts: Array<SeverityText> = [
    {value: Severity.LOW, translationText: 'severities.low'},
    {value: Severity.MEDIUM, translationText: 'severities.medium'},
    {value: Severity.HIGH, translationText: 'severities.high'},
    {value: Severity.CRITICAL, translationText: 'severities.critical'}
  ];

  constructor() { }

  ngOnInit(): void {
  }

  getTranslationKey(): string {
    const index = this.severityTexts.findIndex(statusText => statusText.value === this.currentSeverity);
    return this.severityTexts[index].translationText;
  }
}

interface SeverityText {
  value: Severity;
  translationText: string;
}
