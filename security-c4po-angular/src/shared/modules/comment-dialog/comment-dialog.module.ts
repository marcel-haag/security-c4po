import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {CommentDialogComponent} from '@shared/modules/comment-dialog/comment-dialog.component';
import {CommentDialogService} from '@shared/modules/comment-dialog/service/comment-dialog.service';
import {CommonAppModule} from '../../../app/common-app.module';
import {NbButtonModule, NbCardModule, NbFormFieldModule, NbInputModule, NbSelectModule, NbTagModule} from '@nebular/theme';
import {FlexLayoutModule} from '@angular/flex-layout';
import {FontAwesomeModule} from '@fortawesome/angular-fontawesome';
import {TranslateModule} from '@ngx-translate/core';
import {ReactiveFormsModule} from '@angular/forms';


@NgModule({
  declarations: [
    CommentDialogComponent
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
    NbSelectModule,
    NbTagModule,
    ReactiveFormsModule,
  ],
  providers: [
    CommentDialogService,
  ],
  entryComponents: [
    CommentDialogComponent
  ]
})
export class CommentDialogModule {
}
