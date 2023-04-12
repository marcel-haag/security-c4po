import {Component, OnInit} from '@angular/core';
import * as FA from '@fortawesome/free-solid-svg-icons';
import {Route} from '@shared/models/route.enum';
import {Store} from '@ngxs/store';
import {Router} from '@angular/router';
import {PROJECT_STATE_NAME, ProjectState} from '@shared/stores/project-state/project-state';
import {UntilDestroy, untilDestroyed} from '@ngneat/until-destroy';
import {BehaviorSubject} from 'rxjs';
import {Project, ProjectDialogBody} from '@shared/models/project.model';
import {ProjectDialogComponent} from '@shared/modules/project-dialog/project-dialog.component';
import {filter, mergeMap} from 'rxjs/operators';
import {NotificationService, PopupType} from '@shared/services/toaster-service/notification.service';
import {ProjectService} from '@shared/services/api/project.service';
import {DialogService} from '@shared/services/dialog-service/dialog.service';
import {ProjectDialogService} from '@shared/modules/project-dialog/service/project-dialog.service';
import {InitProjectState} from '@shared/stores/project-state/project-state.actions';
import {ExportReportDialogService} from '@shared/modules/export-report-dialog/service/export-report-dialog.service';
import {ExportReportDialogComponent} from '@shared/modules/export-report-dialog/export-report-dialog.component';
import {NbMenuItem} from '@nebular/theme/components/menu/menu.service';
import {NbMenuService} from '@nebular/theme';
import {TranslateService} from '@ngx-translate/core';

@UntilDestroy()
@Component({
  selector: 'app-objective-header',
  templateUrl: './objective-header.component.html',
  styleUrls: ['./objective-header.component.scss']
})
export class ObjectiveHeaderComponent implements OnInit {

  selectedProject$: BehaviorSubject<Project> = new BehaviorSubject<Project>(null);
  // Menu only
  readonly editIcon = 'edit';
  readonly fileExportIcon = 'file-export';
  // Mobile menu properties
  objectiveActionItems: NbMenuItem[] = [
    {
      title: 'global.action.edit',
      icon: { icon: this.editIcon, pack: 'fas' }
    },
    {
      title: 'global.action.report',
      icon: { icon: this.fileExportIcon, pack: 'fas' }
    },
  ];
  // HTML only
  readonly fa = FA;
  readonly BARS_IMG = 'assets/images/icons/bars.svg';
  readonly ELLIPSIS_IMG = 'assets/images/icons/ellipsis.svg';

  constructor(private store: Store,
              private readonly notificationService: NotificationService,
              private dialogService: DialogService,
              private projectDialogService: ProjectDialogService,
              private projectService: ProjectService,
              private exportReportDialogService: ExportReportDialogService,
              private readonly router: Router,
              private translateService: TranslateService,
              private menuService: NbMenuService
              ) {
  }

  ngOnInit(): void {
    this.store.select(ProjectState.project).pipe(
      untilDestroyed(this)
    ).subscribe({
      next: (selectedProject: Project) => {
        if (selectedProject) {
          this.selectedProject$.next(selectedProject);
        } else {
          this.router.navigate([Route.PROJECT_OVERVIEW]);
        }
      },
      error: err => {
        console.error(err);
      }
    });

    // Handle user profile menu action selection
    this.menuService.onItemClick()
      .pipe(
        untilDestroyed(this)
      )
      .subscribe((menuBag) => {
        // Makes sure that other menus without icon won't trigger
        if (menuBag.item.icon) {
          // tslint:disable-next-line:no-string-literal
          if (menuBag.item.icon['icon'] === this.editIcon) {
            this.onClickEditPentestProject();
          }
          // tslint:disable-next-line:no-string-literal
          else if (menuBag.item.icon['icon'] === this.fileExportIcon) {
            this.onClickGeneratePentestReport();
          }
        }
      });
    // Setup stream to translate menu action item
    this.translateService.stream('global.action.edit')
      .pipe(
        untilDestroyed(this)
      ).subscribe((text: string) => {
      this.objectiveActionItems[0].title = text;
    });
    // Setup stream to translate menu action item
    this.translateService.stream('global.action.report')
      .pipe(
        untilDestroyed(this)
      ).subscribe((text: string) => {
      this.objectiveActionItems[1].title = text;
    });
  }

  onClickRouteBack(): void {
    this.router.navigate([Route.PROJECT_OVERVIEW])
      .then(
        () => this.store.reset({
          ...this.store.snapshot(),
          [PROJECT_STATE_NAME]: undefined
        })
      ).finally();
  }

  onClickEditPentestProject(): void {
    this.projectDialogService.openProjectDialog(
      ProjectDialogComponent,
      this.selectedProject$.getValue(),
      {
        closeOnEsc: false,
        hasScroll: false,
        autoFocus: true,
        closeOnBackdropClick: false
      }
    ).pipe(
      untilDestroyed(this)
    ).subscribe({
      next: (project) => {
        if (project) {
          this.store.dispatch(new InitProjectState(
            project,
            [],
            []
          )).pipe(
            untilDestroyed(this)
          ).subscribe();
        }
      }
    });
  }

  onClickGeneratePentestReport(): void {
    this.exportReportDialogService.openExportReportDialog(
      ExportReportDialogComponent,
      this.selectedProject$.getValue(),
      {
        closeOnEsc: true,
        hasScroll: false,
        autoFocus: true,
        closeOnBackdropClick: true
      }
    ).pipe(
      filter(value => !!value),
      /*ToDo: Needed?*/
      /*mergeMap((value: ProjectDialogBody) => this.projectService.updateProject(this.selectedProject$.getValue().id, value)),*/
      untilDestroyed(this)
    ).subscribe({
      next: () => {
        // ToDo: Open report in new Tab or just download it?
        // this.notificationService.showPopup('project.popup.update.success', PopupType.SUCCESS);
      },
      error: error => {
        console.error(error);
        // this.notificationService.showPopup('project.popup.update.failed', PopupType.FAILURE);
      }
    });
  }
}
