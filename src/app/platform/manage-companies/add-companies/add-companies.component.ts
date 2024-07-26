import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
import { environment } from '../../../../environment/environment';
import { ChangeDetectorRef } from '@angular/core';

import {
  FormBuilder,
  Validators,
  FormGroup,
  FormsModule,
  AbstractControl,
  FormArray,
  ReactiveFormsModule,
} from '@angular/forms';
import { first } from 'rxjs';
import { ApiService, ApiResponse } from 'src/app/services/api-services.service';
@Component({
  selector: 'app-add-companies',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './add-companies.component.html',
  styleUrls: ['./add-companies.component.scss'],
})
export class AddCompaniesComponent implements OnInit {
  uploadedImages: any[] = [];
  imagesToUpload: any[] = [];
  uploadedthumbnail: any[] = [];
  showDropdown: boolean = false;
  branches: any[] = [];
  companyForm: FormGroup;
  data: any;
  setThumbnail: string = '';
  constructor(
    private toastr: ToastrService,
    private router: Router,
    private fb: FormBuilder,
    private apiService: ApiService,

    private changeDetectorRef: ChangeDetectorRef
  ) {
    this.companyForm = this.fb.group({
      first_name: ['', Validators.required],
      last_name: ['', Validators.required],
      email: ['', Validators.required],
      personal_contact_number: ['', Validators.required],
      password: ['', Validators.required],
      confirm_password: ['', Validators.required],
      address: ['', Validators.required],
      cnic: ['', Validators.required],
      brand_name: ['', Validators.required],
      office_google_link: ['', Validators.required],
      office_address: ['', Validators.required],
      website_link: ['', Validators.required],
    });
  }
  ngOnInit(): void {}
  manageCompany() {
    this.router.navigate(['/companies-management']);
  }

  saveData() {
    if (!this.companyForm.valid) {
      this.markFormGroupTouched(this.companyForm);
      console.log('Form invalid');
      Object.keys(this.companyForm.controls).forEach((key) => {
        const controlErrors = this.companyForm.get(key)?.errors;
        if (controlErrors) {
          console.log('Control:', key, 'Errors:', controlErrors);
        }
      });

      return;
    }
    let payload: any = {
      first_name: this.companyForm.controls['first_name'].value,
      last_name: this.companyForm.controls['last_name'].value,
      email: this.companyForm.controls['email'].value,
      personal_contact_number:
        this.companyForm.controls['personal_contact_number'].value,
      password: this.companyForm.controls['password'].value,
      confirm_password: this.companyForm.controls['confirm_password'].value,
      address: this.companyForm.controls['address'].value,
      cnic: this.companyForm.controls['cnic'].value,
      brand_name: this.companyForm.controls['brand_name'].value,
      office_google_link: this.companyForm.controls['office_google_link'].value,
      office_address: this.companyForm.controls['office_address'].value,
      website_link: this.companyForm.controls['website_link'].value,
    };
    console.log('payload', payload);
    try {
      if (this.data) {
        // this.updateHall(payload);
      } else {
        this.createHall(payload);
      }
    } catch (error) {
      console.error('An error occurred:', error);
    }
  }

  createHall(payload: any) {
    let url = `${environment.baseURL}/api/admin/company/company`;
    this.apiService
      .post(url, payload)
      .pipe(first())
      .subscribe(
        (res: any) => {
          console.log('Response:', res);
          this.apiService.successToster(
            'company Created Successfully',
            'Success'
          );
          this.router.navigate(['/companies-management']);
        },
        (err: any) => {
          console.error('API Error:', err);
          this.apiService.errorToster(
            err.error?.message || 'An unknown error occurred',
            'Error'
          );
        }
      );
  }
  markFormGroupTouched(formGroup: FormGroup) {
    // Mark all form controls in the form group as touched
    Object.values(formGroup.controls).forEach((control) => {
      control.markAsTouched();
      this.apiService.errorToster('Please Check All Input Fields', 'Error');

      if (control instanceof FormGroup) {
        this.markFormGroupTouched(control);
      }
    });
  }
}
