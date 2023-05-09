import {Component, OnInit} from '@angular/core';
import {NbDialogRef} from '@nebular/theme';
import * as FA from '@fortawesome/free-solid-svg-icons';
import {CONTENT_IMAGES, ImageSliderContent} from '@shared/modules/tutorial-dialog/tutorial-content';

@Component({
  selector: 'app-tutorial-dialog',
  templateUrl: './tutorial-dialog.component.html',
  styleUrls: ['./tutorial-dialog.component.scss']
})
export class TutorialDialogComponent implements OnInit {
  // HTML only
  readonly fa = FA;
  readonly FALLBACK_IMAGE = '../../../assets/images/tutorial/IMAGE_404.png';

  images: Array<ImageSliderContent> = CONTENT_IMAGES;

  constructor(protected dialogRef: NbDialogRef<any>) { }

  ngOnInit(): void {
  }

  onClickCancel(): void {
    this.dialogRef.close();
  }

}
