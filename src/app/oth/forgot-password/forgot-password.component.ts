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
import { Router, RouterModule } from '@angular/router';
import { AuthServiceService } from 'src/app/services/auth-service.service';
@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.scss'],
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule, ReactiveFormsModule],
})
export class ForgotPasswordComponent implements OnInit {
  userLogin: FormGroup;
  email: string = '';
  constructor(
    private router: Router,
    private fb: FormBuilder,
    private authService: AuthServiceService
  ) {
    this.userLogin = this.fb.group({
      email: new FormControl('', [Validators.required, Validators.email]),
    });
  }

  ngOnInit(): void { }

  userLoggedIn() {
    this.router.navigate(['reset-password']);
  }
  onSubmit() {
    const emailControl = this.userLogin.get('email');
    if (emailControl) {
      const email = emailControl.value;
      this.authService.sendPasswordResetEmail(email).subscribe(
        (res) => {
          console.log('Password reset email sent successfully.');
        },
        (error) => {
          console.error('Failed to send password reset email:', error);
        }
      );
    } else {
      console.error('Email form control is null.');
    }
  }

  backToLogin() {
    this.router.navigate(['/auth/login']);
  }
}
