import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {CommonAppModule} from '../../../app/common-app.module';
import {NbButtonModule, NbCardModule, NbFormFieldModule, NbInputModule, NbRadioModule} from '@nebular/theme';
import {FlexLayoutModule} from '@angular/flex-layout';
import {FontAwesomeModule} from '@fortawesome/angular-fontawesome';
import {TranslateModule} from '@ngx-translate/core';
import {ReactiveFormsModule} from '@angular/forms';
import {ExportReportDialogComponent} from '@shared/modules/export-report-dialog/export-report-dialog.component';
import {ExportReportDialogService} from '@shared/modules/export-report-dialog/service/export-report-dialog.service';
import {ReportingService} from '@shared/services/reporting/reporting.service';
import {ObjectiveChartModule} from '@shared/modules/objective-chart/objective-chart.module';
import {LoadingBarModule} from '@shared/widgets/loading-bar/loading-bar.module';
import {VersionTagModule} from '@shared/widgets/version-tag/version-tag.module';

@NgModule({
    declarations: [
        ExportReportDialogComponent
    ],
    imports: [
        CommonModule,
        CommonAppModule,
        NbCardModule,
        NbButtonModule,
        NbFormFieldModule,
        NbInputModule,
        FlexLayoutModule,
        FontAwesomeModule,
        TranslateModule,
        ReactiveFormsModule,
        NbRadioModule,
        ObjectiveChartModule,
        LoadingBarModule,
        VersionTagModule
    ],
    providers: [
        ExportReportDialogService,
        ReportingService
    ]
})
export class ExportReportDialogModule { }
