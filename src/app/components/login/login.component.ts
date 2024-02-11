import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import ValidateForm from 'src/app/helpers/validateform';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  type: string = "password";
  isText: boolean = false;
  eyeIcon: string = "fa-eye-slash";
  loginForm!: FormGroup;
  showModal: boolean = false;
  passwordState: string = "Show";

  constructor(private formBuilder: FormBuilder, private auth: AuthService, private router: Router){}

  ngOnInit(): void {
    this.loginForm = this.formBuilder.group({
      username: ['', Validators.required],
      password: ['', Validators.required]
    })
  }

  hideShowPassword(){
    this.isText = !this.isText;
    this.isText ? this.eyeIcon = "fa-eye" : this.eyeIcon = "fa-eye-slash";
    this.isText ? this.type = "text" : this.type = "password";
    this.isText ? this.passwordState = "Hide" : this.passwordState = "Show";
  }

  onLogin() {
  if (this.loginForm.valid) {
    this.auth.login(this.loginForm.value)
      .subscribe({
        next: (response) => {
          console.log(response.message);
          this.loginForm.reset();
          this.router.navigate(['dashboard']);
        },
        error: (response) => {
          console.log(response);
        }
      })
  } else {
    ValidateForm.validateAllFormFields(this.loginForm);
    this.showModal = true;
  }
}

}
