import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})
export class SignupComponent implements OnInit {

  isLoading = false;

  constructor(private authService: AuthService) { }

  ngOnInit() {
  }

  onSignup(signupForm: NgForm) {
    if (signupForm.invalid) {
     // return;
    }
    this.authService.createUser(signupForm.value.emailInput, signupForm.value.passwordInput);

    signupForm.resetForm();
  }

}
