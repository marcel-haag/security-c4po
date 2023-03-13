import {Component, OnDestroy, OnInit} from '@angular/core';
import {NbMenuItem, NbMenuService} from '@nebular/theme';
import {of, Subject} from 'rxjs';
import {Store} from '@ngxs/store';
import {ChangeCategory} from '@shared/stores/project-state/project-state.actions';
import {Category} from '@shared/models/category.model';
import {untilDestroyed} from 'ngx-take-until-destroy';
import {TranslateService} from '@ngx-translate/core';
import {ProjectState} from '@shared/stores/project-state/project-state';
import {catchError, switchMap, tap} from 'rxjs/operators';
import {Pentest, transformPentestsToObjectiveEntries} from '@shared/models/pentest.model';

@Component({
  selector: 'app-objective-categories',
  templateUrl: './objective-categories.component.html',
  styleUrls: ['./objective-categories.component.scss']
})
export class ObjectiveCategoriesComponent implements OnInit, OnDestroy {
  categories: NbMenuItem[] = [];
  selectedCategory: Category = 0;

  private destroy$ = new Subject<void>();

  constructor(private store: Store,
              private menuService: NbMenuService,
              private translateService: TranslateService) {
  }

  ngOnInit(): void {
    this.initTranslation();
    this.store.select(ProjectState.selectedCategory).pipe(
      untilDestroyed(this)
    ).subscribe({
      next: (categoryIndex) => {
        if (categoryIndex) {
          this.selectedCategory = categoryIndex;
          this.categories[categoryIndex].selected = true;
        } else {
          // Set first item in list as selected
          this.categories[0].selected = true;
        }
      },
      error: error => {
        console.error(error);
      }
    });
    this.menuService.onItemClick()
      .pipe(
        untilDestroyed(this)
      )
      .subscribe((menuBag) => {
        this.selectedCategory = menuBag.item.data;
        this.categories.forEach(category => {
          category.selected = false;
        });
        if (this.selectedCategory >= 0) {
          menuBag.item.selected = true;
          this.store.dispatch(new ChangeCategory(this.selectedCategory));
        }
      });
  }

  private initTranslation(): void {
    for (const cat in Category) {
      if (isNaN(Number(cat))) {
        // initialize category menu
        this.translateService.get('categories.' + cat)
          .pipe(
            untilDestroyed(this)
          )
          .subscribe((text: string) => {
            this.categories.push({title: text, data: Category[cat as keyof typeof Category]});
          });
        // set up continuous translation
        this.translateService.stream('categories.' + cat)
          .pipe(
            untilDestroyed(this)
          )
          .subscribe((text: string) => {
            this.categories.forEach(item => {
              if (item.data === Category[cat as keyof typeof Category]) {
                item.title = text;
              }
            });
          });
      }
    }
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
