import {Component, Input, OnDestroy, OnInit} from '@angular/core';
import {Observable, of} from 'rxjs';
import {untilDestroyed} from 'ngx-take-until-destroy';

@Component({
  selector: 'app-loading-spinner',
  templateUrl: './loading-spinner.component.html',
  styleUrls: ['./loading-spinner.component.scss']
})
export class LoadingSpinnerComponent implements OnInit, OnDestroy {

  @Input() isLoading$: Observable<boolean> = of(false);
  loading: boolean;

  ngOnInit(): void {
    this.loading = false;
    this.isLoading$
      .pipe(untilDestroyed(this))
      .subscribe((value: boolean): void => {
        this.loading = value;
      });
  }

  ngOnDestroy(): void {
  }
}
