import {Component, OnInit} from '@angular/core';
import {NbGetters, NbTreeGridDataSource, NbTreeGridDataSourceBuilder} from '@nebular/theme';
import {Pentest, PentestEntry, transformPentestsToEntries} from '@shared/models/pentest.model';
import {PentestService} from '@shared/services/pentest.service';
import {Store} from '@ngxs/store';
import {PROJECT_STATE_NAME, ProjectState} from '@shared/stores/project-state/project-state';
import {UntilDestroy, untilDestroyed} from '@ngneat/until-destroy';
import {catchError, switchMap, tap} from 'rxjs/operators';
import {BehaviorSubject, Observable, of} from 'rxjs';
import {getTitleKeyForRefNumber} from '@shared/functions/categories/get-title-key-for-ref-number.function';
import {Route} from '@shared/models/route.enum';
import {Router} from '@angular/router';
import {ChangePentest} from '@shared/stores/project-state/project-state.actions';

@UntilDestroy()
@Component({
  selector: 'app-objective-table',
  templateUrl: './objective-table.component.html',
  styleUrls: ['./objective-table.component.scss']
})
export class ObjectiveTableComponent implements OnInit {

  loading$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(true);
  columns: Array<PentestColumns> = [PentestColumns.TEST_ID, PentestColumns.TITLE, PentestColumns.STATUS, PentestColumns.FINDINGS];
  dataSource: NbTreeGridDataSource<PentestEntry>;

  private data: PentestEntry[] = [];

  getters: NbGetters<PentestEntry, PentestEntry> = {
    dataGetter: (node: PentestEntry) => node,
    childrenGetter: (node: PentestEntry) => node.childEntries || undefined,
    expandedGetter: (node: PentestEntry) => !!node.expanded,
  };

  constructor(
    private store: Store,
    private pentestService: PentestService,
    private dataSourceBuilder: NbTreeGridDataSourceBuilder<PentestEntry>,
    private readonly router: Router
  ) {
    this.dataSource = dataSourceBuilder.create(this.data, this.getters);
  }

  ngOnInit(): void {
    this.loadPentestData();
  }

  loadPentestData(): void {
    this.store.select(ProjectState.selectedCategory).pipe(
      switchMap(category => this.pentestService.loadPentests(category)),
      tap(() => this.loading$.next(true)),
      catchError(_ => of(null)),
      untilDestroyed(this)
    ).subscribe({
      next: (pentests: Pentest[]) => {
        this.data = transformPentestsToEntries(pentests);
        this.dataSource.setData(this.data, this.getters);
        this.loading$.next(false);
      },
      error: error => {
        this.loading$.next(false);
        console.error(error);
      }
    });
  }

  selectPentest(pentest: Pentest): void {
    /* ToDo: Include again after fixing pentest route
    this.router.navigate([Route.PENTEST])
      .then(
        () => this.store.reset({
          ...this.store.snapshot(),
          // [PROJECT_STATE_NAME]: pentest
        })
      ).finally();
    */
    this.store.dispatch(new ChangePentest(pentest));
  }

  // HTML only
  getTitle(refNumber: string): string {
    return getTitleKeyForRefNumber(refNumber);
  }

  // HTML only
  isLoading(): Observable<boolean> {
    return this.loading$.asObservable();
  }
}

enum PentestColumns {
  TEST_ID = 'testId',
  TITLE = 'title',
  STATUS = 'status',
  FINDINGS = 'findings'
}