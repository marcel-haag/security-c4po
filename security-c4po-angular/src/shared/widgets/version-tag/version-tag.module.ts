import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {VersionTagComponent} from '@shared/widgets/version-tag/version-tag.component';
import {NbTagModule} from '@nebular/theme';
import {TranslateModule} from '@ngx-translate/core';
import {FlexLayoutModule} from '@angular/flex-layout';

@NgModule({
  declarations: [
    VersionTagComponent
  ],
  imports: [
    CommonModule,
    NbTagModule,
    TranslateModule,
    FlexLayoutModule
  ],
  exports: [
    VersionTagComponent
  ]
})
export class VersionTagModule { }
