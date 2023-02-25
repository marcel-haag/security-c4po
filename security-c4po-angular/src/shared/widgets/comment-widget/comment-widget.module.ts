import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FontAwesomeModule} from '@fortawesome/angular-fontawesome';
import {CommentWidgetComponent} from '@shared/widgets/comment-widget/comment-widget.component';


@NgModule({
  declarations: [
    CommentWidgetComponent
  ],
  imports: [
    CommonModule,
    FontAwesomeModule
  ],
  exports: [
    CommentWidgetComponent
  ]
})
export class CommentWidgetModule {
}
