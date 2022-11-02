import {Inject, Injectable, OnDestroy} from '@angular/core';
import {DOCUMENT} from '@angular/common';
import {Platform} from '@angular/cdk/platform';
import {NbOverlayContainerAdapter} from '@nebular/theme';

@Injectable()
export class CustomOverlayContainer extends NbOverlayContainerAdapter implements OnDestroy {
  // tslint:disable-next-line:variable-name
  constructor(@Inject(DOCUMENT) document: Document, _platform: Platform) {
    super(document, _platform);
  }

  protected _createContainer(): void {
    super._createContainer();
    if (!this._containerElement) {
      return;
    }
    const parent = document.body;
    parent.appendChild(this._containerElement);
  }

  ngOnDestroy(): void {
    super.ngOnDestroy();
    this._containerElement = null;
  }
}
