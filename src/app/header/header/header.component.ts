import { Component } from '@angular/core';

@Component({
  selector: 'app-header',
  template: `
    <mat-toolbar color="primary">
      <span><a routerLink='/'>My Messages</a></span>
      <span class="spacer"></span>
      <ul>
        <li>
          <a mat-button routerLink='/create' routerLinkActive='mat-accent'>New Post</a>
        </li>
        <li>
          <a mat-button routerLink='/login' routerLinkActive='mat-accent'>Login</a>
        </li>
        <li>
          <a mat-button routerLink='/signup' routerLinkActive='mat-accent'>Signup</a>
        </li>
      </ul>
    </mat-toolbar>
  `,
  styleUrls: ['./header.component.css']
})
export class HeaderComponent {

}
