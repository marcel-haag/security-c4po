import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {TutorialDialogComponent} from '@shared/modules/tutorial-dialog/tutorial-dialog.component';
import {NbButtonModule, NbCardModule} from '@nebular/theme';
import {FontAwesomeModule} from '@fortawesome/angular-fontawesome';
import {TranslateModule} from '@ngx-translate/core';
import {FlexModule} from '@angular/flex-layout';
import {NgxGlideModule} from 'ngx-glide';

@NgModule({
  declarations: [
    TutorialDialogComponent
  ],
  imports: [
    CommonModule,
    NbCardModule,
    FontAwesomeModule,
    TranslateModule,
    NbButtonModule,
    FlexModule,
    NgxGlideModule
  ],
  exports: [
    TutorialDialogComponent
  ]
})
export class TutorialDialogModule { }
