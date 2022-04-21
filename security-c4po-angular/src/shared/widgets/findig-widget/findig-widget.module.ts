import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FindigWidgetComponent} from '@shared/widgets/findig-widget/findig-widget.component';
import {FontAwesomeModule} from '@fortawesome/angular-fontawesome';

@NgModule({
  declarations: [
    FindigWidgetComponent
  ],
  exports: [
    FindigWidgetComponent
  ],
  imports: [
    CommonModule,
    FontAwesomeModule
  ]
})
export class FindigWidgetModule {
}
