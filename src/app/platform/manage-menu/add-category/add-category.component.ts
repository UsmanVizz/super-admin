import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
import { environment } from '../../../../environment/environment';

import { CategoryService } from '../../../services/category.service';
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

// interface Branch {
//   _id: string;
//   branch_name: string;
//   selected: boolean;
// }
@Component({
  selector: 'app-add-category',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './add-category.component.html',
  styleUrls: ['./add-category.component.scss'],
})
export class AddCategoryComponent implements OnInit {
  uploadedImages: any[] = [];
  imagesToUpload: any[] = [];
  uploadedthumbnail: any[] = [];
  showDropdown: boolean = false;
  branches: any[] = [];
  categoryForm: FormGroup;
  data: any;
  setThumbnail: string = '';

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
  manageCategory() {
    this.router.navigate(['/manage-menu/catagories']);
  }
  toggleDropdown(): void {
    this.showDropdown = !this.showDropdown;
  }
  getAllBranches() {
    let url = new URL(`${environment.baseURL}/api/hall/branch/branches`);
    this.apiService
      .get(url.href)
      .pipe(first())
      .subscribe(
        (response: any) => {
          this.branches = response.branches.map((branch: any) => ({
            _id: branch._id,
            branch_name: branch.branch_name,
          }));
          console.log('all branches', this.branches);
        },
        (error: any) => {
          console.log(error);
        }
      );
  }
  constructor(
    private toastr: ToastrService,
    private router: Router,
    private fb: FormBuilder,
    private apiService: ApiService,
    private categoryService: CategoryService
  ) {
    this.categoryForm = this.fb.group({
      category_name: ['', Validators.required],
      branch_id: ['', Validators.required],
      category_description: ['', Validators.required],
    });
  }
  ngOnInit(): void {
    this.getAllBranches();
  }

  /////////////////////////////////////////////////////////////////////////////////////////////

  onFileSelected(event: any) {
    const files = event.target.files;
    if (files && files.length > 0) {
      const allowedExtensions = ['jpg', 'jpeg', 'png'];
      const formData = new FormData();

      // Check each file for its extension
      for (let i = 0; i < files.length; i++) {
        const fileExtension = files[i].name.split('.').pop()?.toLowerCase();
        if (fileExtension && allowedExtensions.includes(fileExtension)) {
          const uniqueFileName = `${Date.now()}-${files[i].name}`;
          formData.append('images', files[i], uniqueFileName);
          console.log(`File appended: ${uniqueFileName}`);
        } else {
          console.error('Error: Invalid file type -', files[i].name);
          this.toastr.error('Invalid file type');
          alert(
            'Please select files with valid extensions (.jpg, .jpeg, .png).'
          );
        }
      }
      event.target.value = '';
      // If all files are valid, upload them
      this.categoryService.uploadImage(formData).subscribe((res: any[]) => {
        this.uploadedImages.push(...res); // Spread operator to push all images
        // console.log("Upload", res); // Log all uploaded images in one console
      });
    }
  }

  removeImage(index: number) {
    this.uploadedImages.splice(index, 1);
  }

  //////////////////////////////////////////////////////////////////////////////////////////////
  onThumbnailSelected(event: any): void {
    const files: FileList = event.target.files;
    if (files && files.length > 0) {
      const allowedExtensions = ['jpg', 'jpeg', 'png'];
      const fileExtension = files[0].name.split('.').pop()?.toLowerCase();

      if (fileExtension && allowedExtensions.includes(fileExtension)) {
        const formData = new FormData();
        formData.append('thumbnail', files[0], files[0].name);

        this.categoryService.uploadThumbnail(formData).subscribe((res: any) => {
          this.uploadedthumbnail.push(res);
          console.log('Upload successful Thumbnail', res);
          this.uploadedthumbnail = res;
          this.setThumbnail = res?.[0]?.url;
          console.log('Uploaded Thumbnail URL ', this.setThumbnail);
        });
      } else {
        console.error('Error: Invalid file type');
        this.toastr.error('Error: Invalid file type');
        alert('Please select files with valid extensions (.jpg, .jpeg, .png).');
      }
    }
  }

  removeThumbnail(image: any): void {
    // console.log("log");
    const index: number = this.uploadedthumbnail.indexOf(image);
    if (index !== -1) {
      this.uploadedthumbnail.splice(index, 1);
      const fileUploadElement: HTMLInputElement | null =
        document.getElementById('thumbnail-upload') as HTMLInputElement;
      if (fileUploadElement) {
        fileUploadElement.value = '';
      }
    }
  }

  uploadImageAndGetURL(file: File): Promise<string> {
    return new Promise<string>((resolve) => {
      const reader = new FileReader();
      reader.onload = (e: any) => {
        const placeholderImageUrl: string = e.target.result;
        resolve(placeholderImageUrl);
      };
      reader.readAsDataURL(file);
    });
  }

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

    let selectedBranches: string[] = [];
    if (this.branches && Array.isArray(this.branches)) {
      selectedBranches = this.branches
        .filter((branch) => branch.selected)
        .map((branch) => branch._id); // Assuming _id is the ID field for amenities
    }
    console.log('selectedBranches', selectedBranches);
    let payload: any = {
      category_name: this.categoryForm.controls['category_name'].value,
      category_description:
        this.categoryForm.controls['category_description'].value,
      // branch_id: selectedBranches,
      branch_id: this.categoryForm.controls['branch_id'].value,
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
    let url = `${environment.baseURL}/api/hall/menu_category/menu_category`;
    this.apiService
      .post(url, payload)
      .pipe(first())
      .subscribe(
        (res: any) => {
          console.log('Response:', res);
          this.apiService.successToster(
            'Category Created Successfully',
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
