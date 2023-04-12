import {ChangeDetectionStrategy, Component, OnDestroy, OnInit} from '@angular/core';
import * as FA from '@fortawesome/free-solid-svg-icons';
import {BehaviorSubject} from 'rxjs';
import {PentestStatus} from '@shared/models/pentest-status.model';
import {Store} from '@ngxs/store';
import {ProjectState} from '@shared/stores/project-state/project-state';
import {UntilDestroy, untilDestroyed} from '@ngneat/until-destroy';
import {Pentest, transformPentestToRequestBody} from '@shared/models/pentest.model';
import {ChangePentest, UpdatePentestStatus, UpdatePentestTime} from '@shared/stores/project-state/project-state.actions';
import {NotificationService, PopupType} from '@shared/services/toaster-service/notification.service';
import {PentestService} from '@shared/services/api/pentest.service';
import {Project} from '@shared/models/project.model';

@Component({
  selector: 'app-timer',
  templateUrl: './timer.component.html',
  styleUrls: ['./timer.component.scss'],
  changeDetection: ChangeDetectionStrategy.Default
})
@UntilDestroy()
export class TimerComponent implements OnInit, OnDestroy {

  readonly fa = FA;

  timer = 0;
  interval;

  pentestInfo$: BehaviorSubject<Pentest> = new BehaviorSubject<Pentest>(null);
  timerRunning$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  // Needed for initial pentest creation
  selectedProjectId$: BehaviorSubject<string> = new BehaviorSubject<string>('');

  constructor(private pentestService: PentestService,
              private notificationService: NotificationService,
              private readonly store: Store) {
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

    this.store.selectOnce(ProjectState.pentest).pipe(
      untilDestroyed(this)
    ).subscribe({
      next: (selectedPentest: Pentest) => {
        this.pentestInfo$.next(selectedPentest);
        // In case pentest time spent is undefined use 0
        this.timer = selectedPentest.timeSpent ? selectedPentest.timeSpent : 0;
        if (!selectedPentest.id) {
          this.createIntialPentestInBackend();
        }
      },
      error: err => {
        console.error(err);
      }
    });
  }

  private createIntialPentestInBackend(): void {
    // Save initial pentest a new
    this.pentestInfo$.next({...this.pentestInfo$.getValue(), timeSpent: this.timer});
    this.pentestService.savePentest(this.selectedProjectId$.getValue(), transformPentestToRequestBody(this.pentestInfo$.getValue()))
      .subscribe({
        next: (pentest: Pentest) => {
          this.store.dispatch(new ChangePentest(pentest));
          this.notificationService.showPopup('pentest.popup.initial.save.success', PopupType.INFO);
        },
        error: err => {
          console.log(err);
          this.notificationService.showPopup('pentest.popup.initial.save.failed', PopupType.FAILURE);
        }
      });
  }

  onClickTriggerTimer(): void {
    this.timerRunning$.next(!this.timerRunning$.getValue());
    // Start or pause timer
    if (this.timerRunning$.getValue()) {
      this.startTimer();
    } else {
      this.pauseTimer();
    }
  }

  // TIMER related functions below
  private startTimer(): boolean {
    this.interval = setInterval(() => this.timer++, 1000);
    this.store.dispatch(new UpdatePentestStatus(PentestStatus.IN_PROGRESS));
    return true;
  }

  private pauseTimer(): boolean {
    clearInterval(this.interval);
    this.store.dispatch(new UpdatePentestTime(this.timer));
    this.store.dispatch(new UpdatePentestStatus(PentestStatus.PAUSED));
    return false;
  }

  /**
   * @return the correct nb-status for current pentest-status
   */
  getStopwatchButtonStatus(): string {
    const value: PentestStatus = this.pentestInfo$.getValue().status;
    let stopwatchButtonStatus;
    switch (value) {
      case PentestStatus.NOT_STARTED: {
        stopwatchButtonStatus = 'basic';
        break;
      }
      case PentestStatus.PAUSED: {
        stopwatchButtonStatus = 'info';
        break;
      }
      case PentestStatus.IN_PROGRESS: {
        stopwatchButtonStatus = 'warning';
        break;
      }
      case PentestStatus.COMPLETED: {
        stopwatchButtonStatus = 'success';
        break;
      }
      default: {
        stopwatchButtonStatus = 'basic';
        break;
      }
    }
    return stopwatchButtonStatus;
  }

  ngOnDestroy(): void {
    // Automatically push new time spent to store
    this.store.dispatch(new UpdatePentestTime(this.timer));
  }
}
