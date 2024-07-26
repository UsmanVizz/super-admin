import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
import { environment } from '../../../../environment/environment';
import Swal from 'sweetalert2';
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
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-edit-companies',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './edit-companies.component.html',
  styleUrls: ['./edit-companies.component.scss'],
})
export class EditCompaniesComponent {
  uploadedImages: any[] = [];
  imagesToUpload: any[] = [];
  uploadedthumbnail: any[] = [];
  showDropdown: boolean = false;
  branches: any[] = [];
  companyForm: FormGroup;
  data: any;
  setThumbnail: string = '';
  id: any;
  tableData: any;
  constructor(
    private routes: ActivatedRoute,
    private router: Router,
    private fb: FormBuilder,
    private apiService: ApiService
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
      joining_date: ['', Validators.required],
    });
  }
  ngOnInit(): void {
    this.routes.params.subscribe((params) => {
      this.id = params['id'];
      this.getAllCompanies();
    });
  }
  getAllCompanies(page: number = 1): void {
    const url = new URL(`${environment.baseURL}/api/admin/company/company`);

    this.apiService
      .get(url.href)
      .pipe(first())
      .subscribe(
        (response: any) => {
          this.tableData = response.data[0];
          if (this.tableData) {
            this.companyForm.patchValue({
              first_name: this.tableData.first_name,
              last_name: this.tableData.last_name,
              email: this.tableData.email,
              personal_contact_number: this.tableData.personal_contact_number,
              password: this.tableData.password,
              confirm_password: this.tableData.confirm_password,
              address: this.tableData.address,
              cnic: this.tableData.cnic,
              brand_name: this.tableData.brand_name,
              office_google_link: this.tableData.office_google_link,
              office_address: this.tableData.office_address,
              website_link: this.tableData.website_link,
              joining_date: this.tableData.joining_date,
            });
          }
          this.companyForm.markAsPristine();
          this.companyForm.markAsUntouched();
          console.log('tableData', this.tableData);
        },
        (error) => {
          console.error('Error fetching categories:', error);
          this.tableData = [];
        }
      );
  }
  manageCompany() {
    this.router.navigate(['/companies-management']);
  }
  updateCompany(): void {
    if (!this.companyForm.valid) {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Please check all input fields and ensure the form is valid.',
      });
      return;
    }
    const url = `${environment.baseURL}/api/admin/company/company/${this.id}`;
    const newData = this.companyForm.value;

    this.apiService
      .put(url, newData)
      .pipe(first())
      .subscribe(
        (response) => {
          console.log('Categories updated successfully:', response);
          this.apiService.successToster(
            'Categories Updated Successfully',
            'Success'
          );
          this.router.navigate(['/companies-management']);
        },
        (error) => {
          console.error('Error updating Hall:', error);
          this.apiService.errorToster(error.error['message'], 'Error');
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
