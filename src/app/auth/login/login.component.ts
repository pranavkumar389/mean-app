import { Component, OnInit, OnDestroy } from '@angular/core';
import { NgForm } from '@angular/forms';
import { AuthService } from '../auth.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit, OnDestroy {

  isLoading = false;
  private authStatusSubs: Subscription;

  constructor(private authService: AuthService) { }

  ngOnInit() {
    this.authStatusSubs = this.authService.getAuthStatusListner().subscribe(authStatus => {
      this.isLoading = false;
    });
  }

  onLogin(loginForm: NgForm) {
    if (loginForm.invalid) {
      return;
    }
    this.isLoading = true;
    this.authService.login(loginForm.value.emailInput, loginForm.value.passwordInput);
    loginForm.resetForm();
  }

  ngOnDestroy() {
    if (this.authStatusSubs) {
      this.authStatusSubs.unsubscribe();
    }
  }

}
