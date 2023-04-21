import {Component, OnInit} from '@angular/core';
import {NbGetters, NbTreeGridDataSource, NbTreeGridDataSourceBuilder} from '@nebular/theme';
import {ObjectiveEntry, Pentest, transformPentestsToObjectiveEntries} from '@shared/models/pentest.model';
import {PentestService} from '@shared/services/api/pentest.service';
import {Store} from '@ngxs/store';
import {ProjectState} from '@shared/stores/project-state/project-state';
import {UntilDestroy, untilDestroyed} from '@ngneat/until-destroy';
import {catchError, filter, switchMap, tap} from 'rxjs/operators';
import {BehaviorSubject, Observable, of} from 'rxjs';
import {getTitleKeyForRefNumber} from '@shared/functions/categories/get-title-key-for-ref-number.function';
import {Router} from '@angular/router';
import {ChangePentest} from '@shared/stores/project-state/project-state.actions';
import {Route} from '@shared/models/route.enum';
import * as FA from '@fortawesome/free-solid-svg-icons';
import {DialogService} from '@shared/services/dialog-service/dialog.service';
import {NotificationService, PopupType} from '@shared/services/toaster-service/notification.service';
import {Project} from '@shared/models/project.model';
import {sortDescending} from '@shared/functions/sort-names.function';

@UntilDestroy()
@Component({
  selector: 'app-objective-table',
  templateUrl: './objective-table.component.html',
  styleUrls: ['./objective-table.component.scss']
})
export class ObjectiveTableComponent implements OnInit {
  // HTML only
  readonly fa = FA;

  loading$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(true);
  columns: Array<ObjectiveColumns> = [
    ObjectiveColumns.TEST_ID,
    ObjectiveColumns.TITLE,
    ObjectiveColumns.STATUS,
    ObjectiveColumns.FINDINGS_AND_COMMENTS,
    ObjectiveColumns.ACTIONS
  ];
  dataSource: NbTreeGridDataSource<ObjectiveEntry>;

  private data: ObjectiveEntry[] = [];
  private pentests$: BehaviorSubject<Pentest[]> = new BehaviorSubject<Pentest[]>([]);
  // Needed for pentest enabling and disabling
  selectedProjectId$: BehaviorSubject<string> = new BehaviorSubject<string>('');

  getters: NbGetters<ObjectiveEntry, ObjectiveEntry> = {
    dataGetter: (node: ObjectiveEntry) => node,
    childrenGetter: (node: ObjectiveEntry) => node.childEntries || undefined,
    expandedGetter: (node: ObjectiveEntry) => !!node.expanded,
  };

  constructor(
    private store: Store,
    private pentestService: PentestService,
    private dialogService: DialogService,
    private notificationService: NotificationService,
    private dataSourceBuilder: NbTreeGridDataSourceBuilder<ObjectiveEntry>,
    private router: Router
  ) {
    this.dataSource = dataSourceBuilder.create(this.data, this.getters);
  }

  ngOnInit(): void {
    this.store.selectOnce(ProjectState.project).pipe(
      untilDestroyed(this)
    ).subscribe({
      next: (selectedProject: Project) => {
        this.selectedProjectId$.next(selectedProject.id);
      },
      error: err => {
        console.error(err);
      }
    });
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
        // Sort data without before adding as table data source
        const sortedPentests = pentests.sort((a: Pentest, b: Pentest) =>
          sortDescending(a.refNumber.toLowerCase(), b.refNumber.toLowerCase())
        );
        this.pentests$.next(sortedPentests);
        this.data = transformPentestsToObjectiveEntries(sortedPentests);
        this.dataSource.setData(this.data, this.getters);
        this.loading$.next(false);
      },
      error: error => {
        this.loading$.next(false);
        console.error(error);
      }
    });
  }

  onClickRouteToObjectivePentest(selectedPentest: Pentest): void {
    if (selectedPentest.enabled) {

      this.router.navigate([Route.PENTEST_OBJECTIVE])
        .then(
          () => this.store.reset({
            ...this.store.snapshot(),
          })
        ).finally();
      // Change Pentest State
      const statePentest: Pentest = this.pentests$.getValue().find(pentest => pentest.refNumber === selectedPentest.refNumber);
      if (statePentest) {
        this.store.dispatch(new ChangePentest(statePentest));
      } else {
        let childEntryStatePentest;
        // ToDo: Fix wrong selection
        // tslint:disable-next-line:prefer-for-of
        for (let i = 0; i < this.pentests$.getValue().length; i++) {
          if (this.pentests$.getValue()[i].childEntries) {
            const findingResult = this.pentests$.getValue()[i].childEntries.find(cE => cE.refNumber === selectedPentest.refNumber);
            if (findingResult) {
              childEntryStatePentest = findingResult;
              break;
            }
          }
        }
        this.store.dispatch(new ChangePentest(childEntryStatePentest));
      }
    }
  }

  onClickDisableOrEnableObjective(pentest): void {
    if (pentest.data.enabled) {
      const message = {
        title: 'pentest.disable.title',
        key: 'pentest.disable.key',
        data: {name: pentest.data.refNumber},
      };
      this.dialogService.openConfirmDialog(
        message
      ).onClose.pipe(
        filter((confirm) => !!confirm),
        untilDestroyed(this)
      ).subscribe({
        next: () => {
          this.pentestService.disableObjective(this.selectedProjectId$.getValue(), pentest.data.id).pipe(
            untilDestroyed(this)
          ).subscribe({
            next: () => {
              this.loadPentestData();
              this.notificationService.showPopup('pentest.popup.disable.success', PopupType.SUCCESS);
            },
            error: (err) => {
              this.notificationService.showPopup('pentest.popup.disable.failed', PopupType.FAILURE);
              console.error(err);
            }
          });
        }
      });
    } else {
      this.pentestService.enableObjective(this.selectedProjectId$.getValue(), pentest.data.id).pipe(
        untilDestroyed(this)
      ).subscribe({
        next: () => {
          this.loadPentestData();
          this.notificationService.showPopup('pentest.popup.enable.success', PopupType.SUCCESS);
        },
        error: (err) => {
          this.notificationService.showPopup('pentest.popup.enable.failed', PopupType.FAILURE);
          console.error(err);
        }
      });
    }
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

enum ObjectiveColumns {
  TEST_ID = 'testId',
  TITLE = 'title',
  STATUS = 'status',
  FINDINGS_AND_COMMENTS = 'findings&comments',
  ACTIONS = 'actions'
}
