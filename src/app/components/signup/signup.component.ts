import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  Validators,
} from '@angular/forms';
import { Router } from '@angular/router';
import ValidateForm from 'src/app/helpers/validateform';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.scss'],
})
export class SignupComponent implements OnInit {
  type: string = 'password';
  isText: boolean = false;
  eyeIcon: string = 'fa-eye-slash';
  signupForm!: FormGroup;
  showModal: boolean = false;
  error: string = 'Login failed. Please check your credentials.';
  passwordState: string = "Show";


  constructor(
    private formBuilder: FormBuilder,
    private auth: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.signupForm = this.formBuilder.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      email: ['', Validators.required],
      username: ['', Validators.required],
      password: ['', Validators.required],
    });
  }

  hideShowPassword() {
    this.isText = !this.isText;
    this.isText ? (this.eyeIcon = 'fa-eye') : (this.eyeIcon = 'fa-eye-slash');
    this.isText ? (this.type = 'text') : (this.type = 'password');
    this.isText ? this.passwordState = "Hide" : this.passwordState = "Show";
  }

  onSignup() {
    if (this.signupForm.valid) {
      this.auth.signUp(this.signupForm.value).subscribe({
        next: (response) => {
          this.signupForm.reset();
          this.router.navigate(['login']);
        },
        error: (response) => {
          this.error = response.error.message;;
          this.showModal = true;
        },
      });
    } else {
      ValidateForm.validateAllFormFields(this.signupForm);
      this.showModal = true;
    }
  }


}
