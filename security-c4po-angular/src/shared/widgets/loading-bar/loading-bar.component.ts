import {ChangeDetectorRef, Component, Input, OnChanges, OnInit} from '@angular/core';
import {Observable, of} from 'rxjs';
import {UntilDestroy, untilDestroyed} from '@ngneat/until-destroy';

@UntilDestroy()
@Component({
  selector: 'app-loading-bar',
  templateUrl: './loading-bar.component.html',
  styleUrls: ['./loading-bar.component.scss']
})
export class LoadingBarComponent implements OnInit, OnChanges {

  @Input() isLoading$: Observable<boolean> = of(false);
  @Input() loadingProgress = 0;

  loading: boolean;

  constructor() {
  }

  ngOnInit(): void {
    this.loading = false;
    this.isLoading$
      .pipe(untilDestroyed(this))
      .subscribe((value: boolean): void => {
        this.loading = value;
      });
  }

  ngOnChanges(): void {
    // tslint:disable-next-line:no-console
    console.info('Current loading progress: ', this.loadingProgress);
  }

}
