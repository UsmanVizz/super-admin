import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { AuthServiceService } from 'src/app/services/auth-service.service';
import { Router, RouterModule } from '@angular/router';
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule, ReactiveFormsModule],
})
export class LoginComponent implements OnInit {
  userLogin: FormGroup;
  hidePassword: boolean = true;

  constructor(
    private router: Router,
    private fb: FormBuilder,
    private toastr: ToastrService,
    private authService: AuthServiceService
  ) {
    this.userLogin = this.fb.group({
      email: new FormControl('', [Validators.required, Validators.email]),
      password: new FormControl('', [Validators.required]),
    });
  }

  ngOnInit(): void {
    // if (this.authService.isLoggedIn()) {
    //   this.router.navigate(['dashboard']);
    // }
  }
  loggedIn() {
    const userEmail = this.userLogin.get('email');
    const userPassword = this.userLogin.get('password');
    if (userEmail && userPassword) {
      if (!userEmail.value || !userPassword.value) {
        this.toastr.error('Please enter email and password');
        return;
      } else {
        this.authService.userLoggedIn(this.userLogin.value).subscribe(
          (res) => {
            // Assuming res.data.token is the token you want to store
            const token = res.data.token;

            // Store token without quotes in localStorage
            localStorage.setItem('user_token', token);

            // Store the whole user object as string
            localStorage.setItem('user', JSON.stringify(res));

            // If you need to use sessionStorage as well
            sessionStorage.setItem('user_token', token);
            sessionStorage.setItem('user', JSON.stringify(res));

            this.toastr.success('Login Successful');
            this.router.navigate(['/dashboard']);
            this.userLogin.reset();
          },
          (err) => {
            if (err.status === 401) {
              this.toastr.error('Something went wrong');
            } else {
              this.toastr.error('Invalid username or password');
            }
          }
        );
      }
    }
  }

  forgotPassword() {
    this.router.navigate(['/auth/forgot-password']);
  }

  togglePasswordVisibility(): void {
    this.hidePassword = !this.hidePassword;
  }
}
