import {Component, Input, OnInit} from '@angular/core';
import * as FA from '@fortawesome/free-solid-svg-icons';
import {GlobalTitlesVariables} from '@shared/config/global-variables';
import {ProjectPentests} from '@shared/models/project.model';
import Chart from 'chart.js/auto';
import {PentestStatus} from '@shared/models/pentest-status.model';
import {TranslateService} from '@ngx-translate/core';
import {UntilDestroy, untilDestroyed} from '@ngneat/until-destroy';

@Component({
  selector: 'app-objective-chart',
  templateUrl: './objective-chart.component.html',
  styleUrls: ['./objective-chart.component.scss']
})
@UntilDestroy()
export class ObjectiveChartComponent implements OnInit {

  readonly fa = FA;
  readonly TOTAL_OWASP_OBJECTIVES: number = GlobalTitlesVariables.TOTAL_OWASP_OBJECTIVES;

  @Input() projectPentestData: ProjectPentests[] = [];

  chart: any;

  data: any;
  options: any;

  pentestStatusColors = {
    disabledDefault: '#000',
    notStartedDefault: '#8f9bb3',
    info: '#34a4fe',
    warning: '#ffab00',
    success: '#01d68f'
  };

  constructor(private translateService: TranslateService) {
  }

  // HTML only
  status = PentestStatus;
  readonly pentestStatusLabels: Array<string> = [
    'pentest.statusText.disabled',
    'pentest.statusText.not_started',
    'pentest.statusText.open',
    'pentest.statusText.in_progress',
    'pentest.statusText.completed'
  ];

  translatedPentestStatusLabels: Array<string> = [];

  ngOnInit(): void {
    this.translateLabels();
    this.createChart();
  }

  createChart(): void {
    // Sort objectives by status
    const disabledPentests: ProjectPentests[]
      = this.projectPentestData.filter(projectPentest => projectPentest.status === PentestStatus.DISABLED);
    const openPentests: ProjectPentests[]
      = this.projectPentestData.filter(projectPentest => projectPentest.status === PentestStatus.OPEN);
    const inProgressPentests: ProjectPentests[]
      = this.projectPentestData.filter(projectPentest => projectPentest.status === PentestStatus.IN_PROGRESS);
    const completedPentests: ProjectPentests[]
      = this.projectPentestData.filter(projectPentest => projectPentest.status === PentestStatus.COMPLETED);
    // Find not started pentest by removing other pentests from total objective count
    const notStartedPentests: number
      = this.TOTAL_OWASP_OBJECTIVES - this.projectPentestData.length;

    // Setup data for chart
    const pentestData = [
      disabledPentests.length,
      notStartedPentests,
      openPentests.length,
      inProgressPentests.length,
      completedPentests.length
    ];
    // increase-legend-spacing
    const increseLegenStylePlugin = {
      id: 'increase-legend-spacing',
      beforeInit(chart: any): void {
        // Get reference to the original fit function
        const originalFit = chart.legend.fit;
        // Override the fit function
        chart.legend.fit = function fit(): void {
          // Call original function and bind scope in order to use `this` correctly inside it
          originalFit.bind(chart.legend)();
          // Change the height as suggested in another answers
          this.height += 25;
        };
      }
    };
    // Build Chart
    this.chart = new Chart('PentestObjectiveChart', {
      type: 'pie', // this denotes tha type of chart

      data: {// values on X-Axis
        labels: this.translatedPentestStatusLabels.length ? this.translatedPentestStatusLabels : this.pentestStatusLabels,
        datasets: [{
          label: ' ',
          data: pentestData,
          backgroundColor: [
            this.pentestStatusColors.disabledDefault,
            this.pentestStatusColors.notStartedDefault,
            this.pentestStatusColors.info,
            this.pentestStatusColors.warning,
            this.pentestStatusColors.success,
          ],
          hoverOffset: 1
        }],
      },
      options: {
        aspectRatio: 2.5,
      },
      plugins: [increseLegenStylePlugin]
    });
  }

  private translateLabels(): void {
    this.pentestStatusLabels.forEach((label, index) => {
      this.translateService.get(label)
        .pipe(untilDestroyed(this))
        .subscribe((translated: string): void => {
          this.translatedPentestStatusLabels[index] = translated;
        });
    });
  }
}
