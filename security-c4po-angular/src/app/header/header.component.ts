import {Component, OnDestroy, OnInit} from '@angular/core';
import * as FA from '@fortawesome/free-solid-svg-icons';
import {NbThemeService} from '@nebular/theme';
import {map} from 'rxjs/operators';
import {untilDestroyed} from 'ngx-take-until-destroy';
import {GlobalTitlesVariables} from '@shared/config/global-variables';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit, OnDestroy {

  readonly fa = FA;
  readonly SECURITYC4PO_TITLE = GlobalTitlesVariables.SECURITYC4PO_TITLE;

  currentTheme = '';

  constructor(private themeService: NbThemeService) { }

  ngOnInit(): void {
    this.themeService.onThemeChange()
      .pipe(
        map(({ name }) => name),
        untilDestroyed(this),
      )
      .subscribe(themeName => this.currentTheme = themeName);
  }

  onClickSwitchTheme(): void {
    if (this.currentTheme === 'corporate') {
      this.themeService.changeTheme('dark');
    } else if (this.currentTheme === 'dark') {
      this.themeService.changeTheme('corporate');
    }
  }

  ngOnDestroy(): void {
    // This method must be present when using ngx-take-until-destroy
    // even when empty
  }
}
