import { Component, OnInit, OnDestroy } from '@angular/core';
import { NgForm } from '@angular/forms';
import { AuthService } from '../auth.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})
export class SignupComponent implements OnInit, OnDestroy {

  isLoading = false;
  private authStatusSubs: Subscription;

  constructor(private authService: AuthService) { }

  ngOnInit() {
    this.authStatusSubs = this.authService.getAuthStatusListner().subscribe(authStatus => {
      this.isLoading = false;
    });
  }

  onSignup(signupForm: NgForm) {
    if (signupForm.invalid) {
     return;
    }
    this.isLoading = true;
    this.authService.createUser(signupForm.value.emailInput, signupForm.value.passwordInput);
    signupForm.resetForm();
  }

  ngOnDestroy() {
    if(this.authStatusSubs) {
      this.authStatusSubs.unsubscribe();
    }
  }

}
