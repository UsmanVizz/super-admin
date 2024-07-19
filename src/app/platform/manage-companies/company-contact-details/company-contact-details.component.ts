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
  selector: 'app-company-contact-details',
  templateUrl: './company-contact-details.component.html',
  styleUrls: ['./company-contact-details.component.scss'],
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
})
export class CompanyContactDetailsComponent implements OnInit {
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
      company_name: ['', Validators.required],
      branch_id: ['', Validators.required],
      company_description: ['', Validators.required],
    });
  }
  ngOnInit(): void {}

  getSelectedBranch(): string | undefined {
    const selectedBranch = this.branches.filter((branch) => branch.selected);
    if (selectedBranch.length === 0) {
      return 'Select Branch';
    } else if (selectedBranch.length === 1) {
      return selectedBranch[0].branch_name;
    } else {
      return selectedBranch.map((branch) => branch.branch_name).join(', ');
    }
  }
  manageCompany() {
    this.router.navigate(['/manage-menu/catagories']);
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

    let selectedBranches: string[] = [];
    if (this.branches && Array.isArray(this.branches)) {
      selectedBranches = this.branches
        .filter((branch) => branch.selected)
        .map((branch) => branch._id); // Assuming _id is the ID field for amenities
    }
    console.log('selectedBranches', selectedBranches);
    let payload: any = {
      company_name: this.companyForm.controls['company_name'].value,
      company_description:
        this.companyForm.controls['company_description'].value,
      // branch_id: selectedBranches,
      branch_id: this.companyForm.controls['branch_id'].value,
      images: this.uploadedImages.map((image) => image.url),
      thumbnail_image: this.setThumbnail,
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
    let url = `${environment.baseURL}/api/hall/menu_company/menu_company`;
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
          this.router.navigate(['/manage-menu/catagories']);
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
