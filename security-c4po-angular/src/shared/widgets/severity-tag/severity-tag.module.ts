import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {SeverityTagComponent} from '@shared/widgets/severity-tag/severity-tag.component';
import {NbTagModule} from '@nebular/theme';
import {TranslateModule} from '@ngx-translate/core';

@NgModule({
  declarations: [
    SeverityTagComponent
  ],
  exports: [
    SeverityTagComponent
  ],
  imports: [
    CommonModule,
    NbTagModule,
    TranslateModule
  ]
})
export class SeverityTagModule { }
