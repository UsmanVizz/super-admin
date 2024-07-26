import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
import { environment } from '../../../../environment/environment';
import { ChangeDetectorRef } from '@angular/core';

import { CategoryService } from '../../../services/category.service';
import {
  FormBuilder,
  Validators,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
} from '@angular/forms';
import { first } from 'rxjs';
import { ApiService } from 'src/app/services/api-services.service';

@Component({
  selector: 'app-add-subscription-plan',
  templateUrl: './add-subscription-plan.component.html',
  styleUrls: ['./add-subscription-plan.component.scss'],
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
})
export class AddSubscriptionPlanComponent implements OnInit {
  categoryForm: FormGroup;
  data: any;
  setThumbnail: string = '';

  constructor(
    private router: Router,
    private fb: FormBuilder,
    private apiService: ApiService
  ) {
    this.categoryForm = this.fb.group({
      category_name: ['', Validators.required],
      branch_id: ['', Validators.required],
      category_description: ['', Validators.required],
    });
  }
  ngOnInit(): void {}
  saveData() {
    if (!this.categoryForm.valid) {
      this.markFormGroupTouched(this.categoryForm);
      console.log('Form invalid');
      Object.keys(this.categoryForm.controls).forEach((key) => {
        const controlErrors = this.categoryForm.get(key)?.errors;
        if (controlErrors) {
          console.log('Control:', key, 'Errors:', controlErrors);
        }
      });

      return;
    }

    let payload: any = {
      category_name: this.categoryForm.controls['category_name'].value,
      category_description:
        this.categoryForm.controls['category_description'].value,
      // branch_id: selectedBranches,
      branch_id: this.categoryForm.controls['branch_id'].value,
    };
    console.log('payload', payload);
    try {
      if (this.data) {
        // this.updateHall(payload);
      } else {
        // this.createHall(payload);
      }
    } catch (error) {
      console.error('An error occurred:', error);
    }
  }

  // createHall(payload: any) {
  //   let url = `${environment.baseURL}/api/hall/menu_category/menu_category`;
  //   this.apiService
  //     .post(url, payload)
  //     .pipe(first())
  //     .subscribe(
  //       (res: any) => {
  //         console.log('Response:', res);
  //         this.apiService.successToster(
  //           'Category Created Successfully',
  //           'Success'
  //         );
  //         this.router.navigate(['/manage-menu/catagories']);
  //       },
  //       (err: any) => {
  //         console.error('API Error:', err);
  //         this.apiService.errorToster(
  //           err.error?.message || 'An unknown error occurred',
  //           'Error'
  //         );
  //       }
  //     );
  // }
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
