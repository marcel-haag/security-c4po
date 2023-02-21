import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {ObjectiveChartComponent} from '@shared/modules/objective-chart/objective-chart.component';
import {FlexLayoutModule} from '@angular/flex-layout';

@NgModule({
  declarations: [
    ObjectiveChartComponent
  ],
  imports: [
    CommonModule,
    FlexLayoutModule
  ],
  exports: [
    ObjectiveChartComponent
  ]
})
export class ObjectiveChartModule { }
