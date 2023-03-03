import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {TimerComponent} from '@shared/modules/timer/timer.component';
import {TimerService} from '@shared/modules/timer/service/timer.service';
import {NbButtonModule, NbCardModule} from '@nebular/theme';
import {FlexLayoutModule} from '@angular/flex-layout';
import {FontAwesomeModule} from '@fortawesome/angular-fontawesome';
import {TimerDurationPipe} from '@shared/pipes/timer-duration.pipe';

@NgModule({
  declarations: [
    TimerComponent,
    TimerDurationPipe
  ],
  imports: [
    CommonModule,
    NbCardModule,
    FlexLayoutModule,
    FontAwesomeModule,
    NbButtonModule
  ],
  providers: [
    TimerService
  ],
  exports: [
    TimerComponent
  ]
})
export class TimerModule { }
