import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {LoadingBarComponent} from '@shared/widgets/loading-bar/loading-bar.component';
import {NbProgressBarModule} from '@nebular/theme';
import {FlexLayoutModule} from '@angular/flex-layout';

@NgModule({
  declarations: [
    LoadingBarComponent
  ],
  imports: [
    CommonModule,
    NbProgressBarModule,
    FlexLayoutModule
  ],
  exports: [
    LoadingBarComponent
  ]
})
export class LoadingBarModule { }
