import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {NbTagModule} from '@nebular/theme';
import {TranslateModule} from '@ngx-translate/core';
import {ReportStateTagComponent} from '@shared/widgets/report-state-tag/report-state-tag.component';



@NgModule({
  declarations: [
    ReportStateTagComponent
  ],
  imports: [
    CommonModule,
    NbTagModule,
    TranslateModule
  ],
  exports: [
    ReportStateTagComponent
  ]
})
export class ReportStateTagModule { }
