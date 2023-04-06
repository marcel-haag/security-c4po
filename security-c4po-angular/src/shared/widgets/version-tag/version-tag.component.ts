import {Component, Input, OnInit} from '@angular/core';

@Component({
  selector: 'app-version-tag',
  templateUrl: './version-tag.component.html',
  styleUrls: ['./version-tag.component.scss']
})
export class VersionTagComponent implements OnInit {

  @Input() version = '';

  constructor() { }

  ngOnInit(): void {
  }

}
