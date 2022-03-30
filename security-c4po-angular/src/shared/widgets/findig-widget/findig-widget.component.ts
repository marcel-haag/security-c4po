import {Component, Input, OnInit} from '@angular/core';
import * as FA from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-findig-widget',
  templateUrl: './findig-widget.component.html',
  styleUrls: ['./findig-widget.component.scss']
})
export class FindigWidgetComponent implements OnInit {
  @Input() numberOfFindigs: number;

  // HTML only
  readonly fa = FA;

  constructor() { }

  ngOnInit(): void {
  }

}
