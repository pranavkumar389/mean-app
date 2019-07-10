import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-header',
  template: `<mat-toolbar color="primary">My Messages</mat-toolbar>`,
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {

  constructor() { }

  ngOnInit() {
  }

}
