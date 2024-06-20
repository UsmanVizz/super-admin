import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
import { environment } from '../../../../environment/environment';

import { CategoryService } from '../../../services/category.service';
import { MenuServiceService } from '../../../services/menu-service.service';
import {
  FormBuilder,
  Validators,
  FormGroup,
  FormsModule,
  AbstractControl,
  ValidationErrors,
  FormArray,
  ReactiveFormsModule,
} from '@angular/forms';
import { first } from 'rxjs';
import { ApiService, ApiResponse } from 'src/app/services/api-services.service';

interface Branch {
  name: string;
  selected: boolean;
}
@Component({
  selector: 'app-add-menu',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './add-menu.component.html',
  styleUrls: ['./add-menu.component.scss'],
})
export class AddMenuComponent implements OnInit {
  showDropdown: boolean = false;
  // branchs: Branch[] = [];
  uploadedImages: any[] = [];
  uploadedthumbnail: any[] = [];
  branches: any[] = [];
  menuForm: FormGroup;
  setThumbnail: string = '';
  categories: any[] = [];

  constructor(
    private toastr: ToastrService,
    private router: Router,
    private fb: FormBuilder,
    private apiService: ApiService,
    private menuService: MenuServiceService
  ) {
    this.menuForm = this.fb.group({
      branch_id: ['', Validators.required],
      category_id: ['', Validators.required],
      item_price_per_head: ['', Validators.required],
      item_name: ['', Validators.required],
      item_description: ['', Validators.required],
    });
  }
  manageMenu() {
    this.router.navigate(['/manage-menu/catagories']);
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
  ngOnInit(): void {
    this.getAllCategories();
    this.getAllBranches();
  }
  // getSelectedBranch(): string | undefined {
  //   const selectedBranch = this.branchs.filter((branch) => branch.selected);
  //   if (selectedBranch.length === 0) {
  //     return 'Select Branch';
  //   } else if (selectedBranch.length === 1) {
  //     return selectedBranch[0].name;
  //   } else {
  //     return selectedBranch.map((branch) => branch.name).join(', ');
  //   }
  // }
  toggleDropdown(): void {
    this.showDropdown = !this.showDropdown;
  }
  //////////////////////////
  add_Menu() {
    let payload: any = {
      branch_id: this.menuForm.controls['branch_id'].value,
      category_id: this.menuForm.controls['category_id'].value,
      item_price_per_head: this.menuForm.controls['item_price_per_head'].value,
      item_name: this.menuForm.controls['item_name'].value,
      item_description: this.menuForm.get('item_description')?.value,
      images: this.uploadedImages.map((image) => image.url),
      thumbnail_image: this.setThumbnail,
    };

    console.log('payload', payload.address);

    try {
      this.createHall(payload);
    } catch (error) {
      console.error('An error occurred:', error);
    }
  }

  createHall(payload: any) {
    let url = `${environment.baseURL}/api/hall/menu_item/menu_item`;
    this.apiService
      .post(url, payload)
      .pipe(first())
      .subscribe(
        (res: any) => {
          console.log('Response:', res);
          this.apiService.successToster(
            res.message || 'Category Created Successfully',
            'Success'
          );
          this.router.navigate(['/manage-menu/menu']);
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

  ///////////////
  ///category///
  getAllCategories() {
    let url = new URL(
      `${environment.baseURL}/api/hall/menu_category/menu_category`
    );
    this.apiService
      .get(url.href)
      .pipe(first())
      .subscribe(
        (response: any) => {
          this.categories = response.data.map((category: any) => ({
            _id: category._id,
            category_name: category.category_name,
          }));
          console.log('all categories', this.categories);
        },
        (error: any) => {
          console.log(error);
        }
      );
  }

  onFileSelected(event: any) {
    const files = event.target.files;
    if (files && files?.length > 0) {
      const allowedExtensions = ['jpg', 'jpeg', 'png'];
      const formData = new FormData();

      // Check each file for its extension
      for (let i = 0; i < files?.length; i++) {
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
      this.menuService.uploadImage(formData).subscribe((res: any[]) => {
        this.uploadedImages.push(...res); // Spread operator to push all images
        // console.log("Upload", res); // Log all uploaded images in one console
      });
    }
  }

  removeImage(image: any) {
    const index = this.uploadedImages.indexOf(image);
    if (index !== -1) {
      this.uploadedImages.splice(index, 1);
    }
  }

  uploadImages() {
    console.log('Uploading images...');
    console.log(this.uploadedImages);
    this.uploadedImages = [];
  }
  onThumbnailSelected(event: any): void {
    const files: FileList = event.target.files;
    if (files && files?.length > 0) {
      const allowedExtensions = ['jpg', 'jpeg', 'png'];
      const fileExtension = files[0].name.split('.').pop()?.toLowerCase();

      if (fileExtension && allowedExtensions.includes(fileExtension)) {
        const formData = new FormData();
        formData.append('thumbnail', files[0], files[0].name);

        this.menuService.uploadThumbnail(formData).subscribe((res: any) => {
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
    console.log('log');
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
}
