import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
import { environment } from '../../../../environment/environment';
import Swal from 'sweetalert2';
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
import { ActivatedRoute } from '@angular/router';
import { ApiService, ApiResponse } from 'src/app/services/api-services.service';
@Component({
  selector: 'app-edit-category',
  templateUrl: './edit-category.component.html',
  styleUrls: ['./edit-category.component.scss'],
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
})
export class EditCategoryComponent implements OnInit {
  uploadedImages: any[] = [];
  imagesToUpload: any[] = [];
  uploadedthumbnail: any;
  showDropdown: boolean = false;
  branches: any[] = [];
  categoryForm: FormGroup;
  data: any;
  cards: any[] = [];
  setThumbnail: string = '';
  id: any;
  constructor(
    private toastr: ToastrService,
    private router: Router,
    private fb: FormBuilder,
    private apiService: ApiService,
    private categoryService: CategoryService,
    private routes: ActivatedRoute
  ) {
    this.categoryForm = this.fb.group({
      category_name: ['', Validators.required],
      branch_id: ['', Validators.required],
      category_description: ['', Validators.required],
    });
  }
  ngOnInit(): void {
    this.getAllBranches();

    this.routes.params.subscribe((params) => {
      this.id = params['id'];
      console.log('Hall ID:', this.id);
      this.getCategory(this.id);
    });
  }

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

  //update
  getCategory(id: any) {
    let url = new URL(
      `${environment.baseURL}/api/hall/menu_category/menu_category/${id}`
    );

    this.apiService
      .get(url.href)
      .pipe(first())
      .subscribe(
        (response: any) => {
          const cards = response.data;
          this.cards = cards;
          this.uploadedImages = cards.images ? cards.images : [];
          this.uploadedthumbnail = cards.thumbnail_image;
          // ? [cards.thumbnail_image]
          // : '';
          console.log('this.uploadedthumbnail', this.uploadedthumbnail);
          if (cards) {
            this.categoryForm.patchValue({
              category_name: cards.category_name,
              branch_id: cards.branch_id,
              category_description: cards.category_description,
            });
            console.log('branch_id', cards?.branch_id);
            this.categoryForm.markAsPristine();
            this.categoryForm.markAsUntouched();
          }
        },
        (error) => {
          console.error('Error fetching category data:', error);
        }
      );
  }

  updateHall(): void {
    console.log(this.id, 'id');
    if (!this.categoryForm.valid) {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Please check all input fields and ensure the form is valid.',
      });
      return;
    }
    const imageUrls = this.uploadedImages.map((image) => image.url);
    // const thumbnailsUrl = this.uploadedthumbnail.map((image) => image.url);
    const url = `${environment.baseURL}/api/hall/menu_category/menu_category/${this.id}`;
    const newData = this.categoryForm.value;
    newData.images = this.uploadedImages;
    newData.thumbnail_image =
      this.uploadedthumbnail === null ? '' : this.uploadedthumbnail;
    console.log(' newData', newData.thumbnail_image);
    console.log(this.id, 'id');
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
          this.router.navigate(['/manage-menu/catagories']);
        },
        (error) => {
          console.error('Error updating Hall:', error);
          this.apiService.errorToster(error.error['message'], 'Error');
        }
      );
  }
  /////////////////////////////////////////////////////////////////////////////////////////////

  onFileSelected(event: any) {
    const files = event.target.files;
    if (files && files.length > 0) {
      const allowedExtensions = ['jpg', 'jpeg', 'png'];
      const formData = new FormData();

      // Check each file for its extension and append with a unique key
      for (let i = 0; i < files.length; i++) {
        const fileExtension = files[i].name.split('.').pop()?.toLowerCase();
        if (fileExtension && allowedExtensions.includes(fileExtension)) {
          // Append timestamp to the file name to ensure uniqueness
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

      // Clear the file input field to avoid caching issues
      event.target.value = '';

      // If all files are valid, upload them
      this.categoryService.uploadImage(formData).subscribe({
        next: (res: any) => {
          res.forEach((ele: any) => {
            console.log('Uploaded image URL:', ele.url);
            this.uploadedImages.push(ele.url);
          });
        },
        error: (err) => {
          console.error('Upload error:', err);
          this.toastr.error('Upload failed');
        },
      });
    } else {
      console.log('No files selected');
    }
  }

  removeImage(index: number) {
    this.uploadedImages.splice(index, 1);
  }

  //////////////////////////////////////////////////////////////////////////////////////////////
  getImageUrl(image: any): string {
    return 'https://dev-backend.hamaravenue.com' + image;
  }

  // Method to handle thumbnail selection
  onThumbnailSelected(event: any): void {
    const files: FileList = event.target.files;
    if (files && files.length > 0) {
      const allowedExtensions = ['jpg', 'jpeg', 'png'];
      const fileExtension = files[0].name.split('.').pop()?.toLowerCase();

      if (fileExtension && allowedExtensions.includes(fileExtension)) {
        const formData = new FormData();
        formData.append('thumbnail', files[0], files[0].name);

        this.categoryService.uploadThumbnail(formData).subscribe(
          (res: any) => {
            // this.uploadedthumbnail.push(res);
            console.log('Upload successful Thumbnail', res.url);
            this.uploadedthumbnail = res?.[0]?.url;
            // this.uploadedthumbnail.push(res?.[0]?.url);
            this.setThumbnail = res?.[0]?.url;
            console.log('Uploaded Thumbnail URL ', this.setThumbnail);
          },
          (err) => {
            console.error('Error uploading image:', err);
          }
        );
      } else {
        console.error('Error: Invalid file type');
        this.toastr.error('Error: Invalid file type');
        alert('Please select files with valid extensions (.jpg, .jpeg, .png).');
      }
    }
  }

  removeThumbnail(image?: any): void {
    // console.log("log");
    // const index: number = this.uploadedthumbnail.indexOf(image);
    // if (index !== -1) {
    //   this.uploadedthumbnail.splice(index, 1);
    //   const fileUploadElement: HTMLInputElement | null =
    //     document.getElementById('thumbnail-upload') as HTMLInputElement;
    //   if (fileUploadElement) {
    //     fileUploadElement.value = '';
    //   }
    // }
    this.uploadedthumbnail = null;
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
