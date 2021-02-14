import {NgModule} from '@angular/core';
import {HomeComponent} from './home.component';
import {CommonModule} from '@angular/common';
import {NbButtonModule, NbCardModule} from '@nebular/theme';

@NgModule({
  declarations: [
    HomeComponent
  ],
  exports: [
    HomeComponent
  ],
  imports: [
    CommonModule,
    NbCardModule,
    NbButtonModule
  ]
})
export class HomeModule {
}
