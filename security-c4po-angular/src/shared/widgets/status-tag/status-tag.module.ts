import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {StatusTagComponent} from '@shared/widgets/status-tag/status-tag.component';
import {NbCardModule, NbTagModule} from '@nebular/theme';
import {TranslateModule} from '@ngx-translate/core';

@NgModule({
  declarations: [
    StatusTagComponent
  ],
  exports: [
    StatusTagComponent
  ],
  imports: [
    CommonModule,
    NbCardModule,
    NbTagModule,
    TranslateModule
  ]
})
export class StatusTagModule {
}
