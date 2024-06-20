import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
import { environment } from '../../../../../environment/environment';
import Swal from 'sweetalert2';
import { MenuServiceService } from '../../../../services/menu-service.service';
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
import { ActivatedRoute } from '@angular/router';
@Component({
  selector: 'app-edit-menu',
  templateUrl: './edit-menu.component.html',
  styleUrls: ['./edit-menu.component.scss'],
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
})
export class EditMenuComponent implements OnInit {
  showDropdown: boolean = false;
  // branchs: Branch[] = [];
  uploadedImages: any[] = [];
  uploadedthumbnail: any;
  branches: any[] = [];
  menuForm: FormGroup;
  setThumbnail: string = '';
  categories: any[] = [];
  id: any;
  cards: any[] = [];

  constructor(
    private toastr: ToastrService,
    private router: Router,
    private fb: FormBuilder,
    private apiService: ApiService,
    private menuService: MenuServiceService,
    private routes: ActivatedRoute
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
    this.routes.params.subscribe((params) => {
      this.id = params['id'];
      console.log('Hall ID:', this.id);
      this.getMenu(this.id);
    });
  }

  toggleDropdown(): void {
    this.showDropdown = !this.showDropdown;
  }
  //update
  getMenu(id: any) {
    let url = new URL(
      `${environment.baseURL}/api/hall/menu_item/menu_item/${id}`
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

          if (cards) {
            this.menuForm.patchValue({
              branch_id: cards.branch_id,
              category_id: cards.category_id,
              item_price_per_head: cards.item_price_per_head,
              item_name: cards.item_name,
              item_description: cards.item_description,
            });
            console.log('branch_id', cards?.branch_id);
            this.menuForm.markAsPristine();
            this.menuForm.markAsUntouched();
          }
        },
        (error) => {
          console.error('Error fetching category data:', error);
        }
      );
  }
  updateMenu(): void {
    console.log(this.id, 'id');
    if (!this.menuForm.valid) {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Please check all input fields and ensure the form is valid.',
      });
      return;
    }
    const imageUrls = this.uploadedImages.map((image) => image.url);
    // const thumbnailsUrl = this.uploadedthumbnail.map((image) => image.url);
    const url = `${environment.baseURL}/api/hall/menu_item/menu_item/${this.id}`;
    const newData = this.menuForm.value;
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
          console.log('Menu updated successfully:', response);
          this.apiService.successToster('Menu Updated Successfully', 'Success');
          this.router.navigate(['/manage-menu/menu']);
        },
        (error) => {
          console.error('Error updating menu:', error);
          this.apiService.errorToster(error.error['message'], 'Error');
        }
      );
  }

  /////////////////////////////////////////////////////////////////////////////////////////////

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

  /////////////////////////////////////////////////////////////////////////////////////////////

  onFileSelected(event: any) {
    const files = event.target.files;
    if (files && files?.length > 0) {
      const allowedExtensions = ['jpg', 'jpeg', 'png'];
      const formData = new FormData();

      // Check each file for its extension and append with a unique key
      for (let i = 0; i < files?.length; i++) {
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
      this.menuService.uploadImage(formData).subscribe({
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
    if (files && files?.length > 0) {
      const allowedExtensions = ['jpg', 'jpeg', 'png'];
      const fileExtension = files[0].name.split('.').pop()?.toLowerCase();

      if (fileExtension && allowedExtensions.includes(fileExtension)) {
        const formData = new FormData();
        formData.append('thumbnail', files[0], files[0].name);

        this.menuService.uploadThumbnail(formData).subscribe(
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
}
