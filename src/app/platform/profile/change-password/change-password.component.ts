import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  FormControl,
  Validators,
  ReactiveFormsModule,
} from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { PasswordRecoverService } from 'src/app/services/password-recover.service';
import { SwalService } from 'src/app/services/swal.service';

@Component({
  selector: 'app-change-password',
  templateUrl: './change-password.component.html',
  styleUrls: ['./change-password.component.scss'],
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule, ReactiveFormsModule],
})
export class ChangePasswordComponent implements OnInit {
  pwdNotMatch: any;
  pwdMatch: any;
  userPassword: FormGroup;
  userId: any;

  constructor(
    private router: Router,
    private fb: FormBuilder,
    private toastr: ToastrService,
    private pwdService: PasswordRecoverService,
    private swalService: SwalService
  ) {
    this.userPassword = this.fb.group({
      current_password: new FormControl('', [Validators.required]),
      new_password: new FormControl('', [Validators.required]),
      confirm_password: new FormControl('', [Validators.required]),
    });
  }

  ngOnInit(): void {}

  enteredNewPwd() {
    const userNewPwd = this.userPassword.get('new_password');
    const userConfirmPwd = this.userPassword.get('confirm_password');
    if (userNewPwd && userConfirmPwd) {
      if (userNewPwd.value !== userConfirmPwd.value) {
        this.pwdNotMatch = true;
        this.pwdMatch = false;
      } else {
        this.pwdNotMatch = false;
        this.pwdMatch = true;
        setTimeout(() => {
          this.pwdMatch = false;
        }, 1000);
      }
    }
  }

  updateUserPwd() {
    const data = this.userPassword?.value;
    this.pwdService.updateUserPwd(data).subscribe(
      (res) => {
        this.toastr.success(res.message);
        // this.swalService.showSuccess(res.message);
        this.userPassword.reset();
        // console.log(res);
      },
      (error) => {
        this.toastr.error(error.message, 'Error', { timeOut: 2000 });
        // this.swalService.showError(error.message);
        console.log(error);
      }
    );
  }

  savePassword() {
    if (this.userPassword.valid) {
      this.updateUserPwd();
      // this.router.navigate(['profile']);
    } else {
      this.toastr.error('Please fill out all required fields.');
    }
  }
  personalInfo() {
    this.router.navigate(['profile']);
  }
  // saveChanges() {
  //   this.router.navigate(['profile']);
  // }
}
