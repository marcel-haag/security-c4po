import {Component, Input, OnInit} from '@angular/core';
import {Observable, of} from 'rxjs';
import {UntilDestroy, untilDestroyed} from '@ngneat/until-destroy';

@UntilDestroy()
@Component({
  selector: 'app-loading-spinner',
  templateUrl: './loading-spinner.component.html',
  styleUrls: ['./loading-spinner.component.scss']
})
export class LoadingSpinnerComponent implements OnInit {

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
}
