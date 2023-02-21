import {Component, OnDestroy, OnInit} from '@angular/core';
import * as FA from '@fortawesome/free-solid-svg-icons';
import {NbThemeService} from '@nebular/theme';
import {map} from 'rxjs/operators';
import {GlobalTitlesVariables} from '@shared/config/global-variables';
import {TranslateService} from '@ngx-translate/core';
import {UntilDestroy, untilDestroyed} from '@ngneat/until-destroy';

@UntilDestroy()
@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit{

  readonly fa = FA;
  readonly SECURITYC4PO_TITLE: string = GlobalTitlesVariables.SECURITYC4PO_TITLE;

  currentTheme = '';
  languages = ['en-US', 'de-DE'];
  selectedLanguage = '';

  constructor(private themeService: NbThemeService, private translateService: TranslateService) { }

  ngOnInit(): void {
    this.themeService.onThemeChange()
      .pipe(
        map(({ name }) => name),
        untilDestroyed(this),
      )
      .subscribe(themeName => this.currentTheme = themeName);
    this.selectedLanguage = this.translateService.currentLang;
  }

  // HTML only
  onClickGoToLink(url: string): void {
    window.open(url, '_blank');
  }

  onClickSwitchTheme(): void {
    if (this.currentTheme === 'corporate') {
      this.themeService.changeTheme('dark');
    } else if (this.currentTheme === 'dark') {
      this.themeService.changeTheme('corporate');
    }
  }

  onClickLanguage(language: string): void {
    this.translateService.use(language);
  }
}
