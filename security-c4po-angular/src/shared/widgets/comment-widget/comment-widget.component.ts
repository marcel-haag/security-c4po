import {Component, Input, OnInit} from '@angular/core';
import * as FA from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-comment-widget',
  templateUrl: './comment-widget.component.html',
  styleUrls: ['./comment-widget.component.scss']
})
export class CommentWidgetComponent implements OnInit {
  @Input() numberOfComments: number;

  // HTML only
  readonly fa = FA;

  constructor() { }

  ngOnInit(): void {
  }

}
