import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { ChangeDetectorRef } from '@angular/core';

import {
  FormBuilder,
  Validators,
  FormGroup,
  FormsModule,
  AbstractControl,
  FormArray,
  ValidationErrors,
  ReactiveFormsModule,
} from '@angular/forms';
import { ToastrService, IndividualConfig } from 'ngx-toastr';
import Swal from 'sweetalert2';
import { environment } from 'src/environment/environment';
import { ApiService, ApiResponse } from 'src/app/services/api-services.service';
import { first } from 'rxjs';
import { CitiesJson } from 'src/app/services/citiesJson.services';
interface amenity {
  _id: string;
  name: string;
  selected: boolean;
}
interface category {
  _id: string;
  name: string;
  selected: boolean;
}
interface Branch {
  _id: string;
  branch_name: string;
  isHall: boolean;
  total_floors: number;
  ground_floor_included: boolean;
  amenities: amenity[];
  address: {
    city: string;
    street_address: string;
  }[];
}

@Component({
  selector: 'app-add-hall',
  templateUrl: './add-hall.component.html',
  styleUrls: ['./add-hall.component.scss'],
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule, ReactiveFormsModule],
})
export class AddHallComponent implements OnInit {
  title: string;
  description: string;
  uploadedImages: any[] = [];
  imagesToUpload: any[] = [];
  resImages: any[] = [];
  showDropdown: boolean = false;
  showEvents: boolean = false;
  branches: any[] = [];
  // amenities: any;
  categories: category[] = [];
  hallForm: FormGroup;
  data: any;
  pakCityList: any;
  amenities: amenity[] = [];
  branchs: any[] = [];
  selectedBranch: any;
  isHall: boolean = false;
  selectedBranchId: any;
  floors: number[] = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
  //dropdwon
  toggleDropdown(): void {
    this.showDropdown = !this.showDropdown;
  }

  getSelectedAmenities(): string {
    const selectedAmenities = this.amenities.filter(
      (amenity) => amenity.selected
    );
    if (selectedAmenities.length === 0) {
      return 'Select Amenitites';
    } else if (selectedAmenities.length === 1) {
      return selectedAmenities[0].name;
    } else {
      return selectedAmenities.map((amenity) => amenity.name).join(', ');
    }
  }

  manageHall() {
    this.router.navigate(['/hall-manage']);
  }
  constructor(
    private formBuilder: FormBuilder,
    private apiService: ApiService,
    private router: Router,
    private citiesJson: CitiesJson,
    private toastr: ToastrService,
    private changeDetectorRef: ChangeDetectorRef
  ) {
    this.title = '';
    this.description = '';
    this.hallForm = this.formBuilder.group({
      hall_title: ['', Validators.required],
      people_capacity: ['', Validators.required],
      hall_description: ['', Validators.required],
      floor: [''],
      ground_floor_included: [false],
      amenities: [],
      rent: ['', Validators.required],
      branch: ['', Validators.required],
      hall_contact: ['', Validators.required],
      city: [{ value: '', disabled: true }, Validators.required],
      // city: ['', Validators.required],
      street_adress: [{ value: '', disabled: true }, , Validators.required],
      attraction: [''],
      event_type: [],
      hall_area: ['', Validators.required],
    });
    this.hallForm
      .get('ground_floor_included')
      ?.valueChanges.subscribe((value) => {
        if (value) {
          this.hallForm.get('floor')?.setValue(''); // Set floor field to empty
          this.hallForm.get('floor')?.disable(); // Disable floor dropdown
          this.toastr.warning(
            'You can select one floor (ground floor or from dropdown)',
            'Floor Alert',
            this.toastrConfig
          );
        } else {
          this.hallForm.get('floor')?.enable(); // Enable floor dropdown
        }
      });
  }
  toastrConfig: Partial<IndividualConfig> = {
    timeOut: 2000, // Set the timeout to 2000ms (2 seconds)
    closeButton: true,
    positionClass: 'toast-top-right',
  };
  ngOnInit(): void {
    // this.amentities = [];
    this.getAllBranches();
    this.getAllAmenities();
    this.getAllCategories();
    this.pakCityList = this.citiesJson.getCities();
  }
  //////Category////
  getAllCategories() {
    let url = `${environment.baseURL}/api/hall/event_category/event_category`;
    this.apiService
      .get(url)
      .pipe(first())
      .subscribe(
        (response: any) => {
          this.categories = response.data.map((category: any) => ({
            _id: category._id,
            name: category.category_name,
            selected: false,
          }));
          console.log('this.categories', this.categories);
        },
        (error) => {
          console.error('Error fetching category:', error);
        }
      );
  }
  toggleCategorySelection(index: number) {
    this.categories[index].selected = !this.categories[index].selected;
  }
  toggleCategory(): void {
    this.showEvents = !this.showEvents;
  }

  getSelectedCategory(): string {
    const selectedEvent = this.categories.filter(
      (category) => category.selected
    );
    if (selectedEvent.length === 0) {
      return 'Select Categories';
    } else if (selectedEvent.length === 1) {
      return selectedEvent[0].name;
    } else {
      return selectedEvent.map((category) => category.name).join(', ');
    }
  }

  ///////
  toggleAmenitySelection(index: number) {
    this.amenities[index].selected = !this.amenities[index].selected;
  }

  /************************** */

  getAllBranches(): void {
    const url = new URL(`${environment.baseURL}/api/hall/branch/branches`);
    this.apiService
      .get(url.href)
      .pipe(first())
      .subscribe(
        (response: any) => {
          this.branches = response.branches.map((branch: any) => ({
            _id: branch._id,
            branch_name: branch.branch_name,
            isHall: branch.isHall,
            total_floors: branch.floors.total_floors,
            ground_floor_included: branch.floors.ground_floor_included,
            amenities: branch.amenities,
            city: branch.address[0].city,
            branch_type: branch.branch_type,
            street_adress: branch.address[0].street_adress,
          }));
          console.log('all branches', this.branches);
        },
        (error) => {
          console.log(error);
        }
      );
  }

  onBranchSelect(event: Event): void {
    const selectElement = event.target as HTMLSelectElement;
    const branchId = selectElement.value;
    this.selectedBranch =
      this.branches.find((branch) => branch._id === branchId) || null;
    console.log('selected branch', this.selectedBranch);

    if (this.selectedBranch) {
      this.populateFloors();
      this.hallForm.patchValue({
        // ground_floor_included: this.selectedBranch.ground_floor_included,
        // floor: this.selectedBranch.total_floors,
        // floor: this.selectedBranch.isHall
        //   ? this.selectedBranch.total_floors
        //   : 0,
        city: this.selectedBranch.city,
        amenities: this.selectedBranch.amenities,
        street_adress: this.selectedBranch.street_adress,
        // branch_type: this.selectedBranch.branch_type,
      });
      console.log('branch type0', this.selectedBranch.floor);
      this.amenities.forEach((amenity) => {
        amenity.selected = this.selectedBranch.amenities.includes(amenity._id);
      });

      console.log('amenities', this.selectedBranch.amenities);
    } else {
      this.floors = [];
      this.hallForm.patchValue({
        ground_floor_included: false,
        floor: 0,
        city: '',
        street_adress: '',
      });
    }
  }
  populateFloors(): void {
    if (
      this.selectedBranch &&
      (this.selectedBranch.branch_type === 'hall' ||
        this.selectedBranch.branch_type === 'outdoor')
    ) {
      this.floors = Array.from(
        { length: this.selectedBranch.total_floors },
        (_, i) => i + 1
      );
    } else {
      this.floors = [];
    }

    // Show toaster if branch type is 'marquee' or 'outdoor' and no floors are available
    if (
      this.selectedBranch &&
      (this.selectedBranch.branch_type === 'marquee' ||
        this.selectedBranch.branch_type === 'outdoor') &&
      this.floors.length === 0
    ) {
      this.toastr.warning(
        `This branch is a ${this.selectedBranch.branch_type} and does not have floors.`,
        'Floor Alert',
        this.toastrConfig
      );
    }
  }

  /****************** */
  getAllAmenities() {
    let url = `${environment.baseURL}/api/public/list_amenities`;
    this.apiService
      .get(url)
      .pipe(first())
      .subscribe(
        (response: any) => {
          this.amenities = response.data.map((amenity: any) => ({
            _id: amenity._id,
            name: amenity.name,
            selected: false,
          }));
        },
        (error) => {
          console.error('Error fetching amenities:', error);
        }
      );
  }
  add_Hall() {
    // Trigger validation display on the form
    this.displayValidationErrors();

    if (!this.hallForm.valid) {
      const validationErrors = this.getValidationErrors(this.hallForm);
      this.toastr.error(
        `
        <ul style="list-style-type: none; padding: 0; margin: 0;">
          ${validationErrors
            .map((error: any) => `<li style="margin-left: 0;">${error}</li>`)
            .join('')}
        </ul>`,
        'Validation Errors',
        {
          enableHtml: true,
          toastClass: 'ngx-toastr alert alert-danger alert-dismissible',
          positionClass: 'toast-top-right',
          timeOut: 5000,
          closeButton: true,
          titleClass: 'toast-title',
          messageClass: 'toast-message',
          extendedTimeOut: 2000,
        }
      );
      return;
    }

    let selectedAmenities: string[] = [];
    if (this.amenities && Array.isArray(this.amenities)) {
      selectedAmenities = this.amenities
        .filter((amenity) => amenity.selected)
        .map((amenity) => amenity._id); // Assuming _id is the ID field for amenities
    }
    let selectedEvent: string[] = [];
    if (this.categories && Array.isArray(this.categories)) {
      selectedEvent = this.categories
        .filter((category) => category.selected)
        .map((category) => category._id);
    }
    console.log('selectedEvent', selectedEvent);
    let payload: any = {
      hall_title: this.hallForm.controls['hall_title'].value,
      people_capacity: this.hallForm.controls['people_capacity'].value,
      hall_description: this.hallForm.controls['hall_description'].value,

      floor: this.hallForm.controls['floor'].value,
      ground_floor_included: this.hallForm.get('ground_floor_included')?.value,

      amenities: selectedAmenities,
      event_type: selectedEvent,
      rent: this.hallForm.controls['rent'].value,
      branch: this.hallForm.controls['branch'].value,
      hall_contact: this.hallForm.controls['hall_contact'].value,
      hall_area: this.hallForm.controls['hall_area'].value,
      attraction: this.hallForm.controls['attraction'].value,
      address: [
        {
          street_adress: this.hallForm.get('street_adress')?.value,
          city: this.hallForm.get('city')?.value,
        },
      ],
      images: this.imagesToUpload,
    };

    console.log('payload', payload.address);

    try {
      if (this.data) {
        this.updateHall(payload);
      } else {
        this.createHall(payload);
      }
    } catch (error) {
      console.error('An error occurred:', error);
    }
  }

  displayValidationErrors() {
    // Mark all fields as touched to trigger validation messages
    Object.keys(this.hallForm.controls).forEach((key) => {
      const control = this.hallForm.get(key);
      if (control) {
        control.markAsTouched();
        control.updateValueAndValidity();
      }
    });
  }

  getValidationErrors(formGroup: FormGroup): string[] {
    const errors: string[] = [];

    // Define custom error messages for specific form controls and their validation errors
    const errorMessages: { [key: string]: { [key: string]: string } } = {
      people_capacity: {
        required: 'Please specify the people capacity.',
        min: 'People capacity must be at least 1.',
      },
      hall_title: {
        required: 'Hall name is required.',
      },
      hall_description: {
        required: 'Hall Description is required.',
      },

      amenities: {
        required: 'Amenities are required.',
      },
      rent: {
        required: 'Hall Rent is required.',
      },
      street_adress: {
        required: 'Street address is required.',
      },
      city: {
        required: 'City is required.',
      },
      branch: {
        required: 'Branch is required.',
      },
      hall_contact: {
        required: 'Hall Contact is required.',
      },
      hall_area: {
        required: 'Hall Area is required.',
      },
      attraction: {
        required: 'Attraction is required.',
      },
      // Add more fields and their custom error messages here
    };

    Object.keys(formGroup.controls).forEach((key) => {
      const control = formGroup.get(key);
      if (control && control.errors) {
        const controlErrors: ValidationErrors = control.errors;
        Object.keys(controlErrors).forEach((keyError) => {
          // Use custom error message if available, otherwise use a generic message
          const errorMessage =
            errorMessages[key]?.[keyError] ||
            `${key} has an error: ${keyError}`;
          errors.push(errorMessage);
        });
      }
    });

    return errors;
  }

  updateHall(data: any) {}
  createHall(payload: any) {
    let url = `${environment.baseURL}/api/hall/sub-hall/sub-hall`;
    console.log('API URL:', url);
    console.log('Payload in createHall:', payload);

    this.apiService
      .post(url, payload)
      .pipe(first())
      .subscribe(
        (res: any) => {
          console.log('Response:', res);
          this.apiService.successToster('Hall Created Successfully', 'Success');
          this.router.navigate(['/hall-manage']);
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

  convertToFormData(formData: any) {
    const form_data = new FormData();
    for (const key in formData) {
      if (Array.isArray(formData[key])) {
        for (let i = 0; i < formData[key].length; i++) {
          form_data.append(key, formData[key][i]);
        }
      } else {
        form_data.append(key, formData[key]);
      }
    }
    return form_data;
  }

  onFileSelected(event: any) {
    const fileList: FileList = event.target.files;
    if (fileList.length === 0) {
      return;
    } else {
      for (let i = 0; i < fileList.length; i++) {
        const file: File = fileList[i];
        const fileSizeKB = file.size / 1024;
        const fileType = file.type;
        if (fileSizeKB >= 5000) {
          this.apiService.errorToster('Image is larger then 5 mb', 'Error');

          return;
        }
        if (!fileType.startsWith('image/')) {
          this.apiService.errorToster('File Type is not an Image', 'Error');

          return;
        }
        const existingImage = this.uploadedImages.find(
          (img) => img.name === file.name
        );
        if (existingImage) {
          this.apiService.errorToster(
            'Image with the same name already uploaded',
            'Error'
          );
          continue; // Skip adding this image
        }
        // this.uplaodImageToServer(file);
        // this.imagesToUpload.push(file);
        const imgDataUrl = this.readFileAsDataURL(file);
        const reader = new FileReader();
        reader.onload = (e: any) => {
          this.uploadedImages.push({ name: file.name, url: e.target.result });
        };
        reader.readAsDataURL(file);
        event.target.value = '';
        this.uploadImageToServer(file);
        console.log('this.uploadedImages', this.uploadedImages);
      }
    }
  }

  uploadImageToServer(file: File) {
    const formData = new FormData();
    const uniqueFileName = `${Date.now()}-${file.name}`;
    formData.append('images', file, uniqueFileName);

    let url = `${environment.baseURL}/api/hall/branch/upload-images`;
    this.apiService
      .post(url, formData)
      .pipe(first())
      .subscribe(
        (res: any) => {
          console.log('Upload response:', res);
          // this.uploadedImages.push(...res);
          this.imagesToUpload.push(res.file[0].file_url);
          // this.updateLocalStorage();
        },
        (error) => {
          console.error('Upload error:', error);
        }
      );
  }
  updateLocalStorage() {
    localStorage.setItem('uploadedImages', JSON.stringify(this.uploadedImages));
    localStorage.setItem('imagesToUpload', JSON.stringify(this.imagesToUpload));
  }

  private readFileAsDataURL(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  }
  removeImage(image: any): void {
    const index: number = this.uploadedImages.findIndex((img) => img === image);
    if (index !== -1) {
      this.uploadedImages.splice(index, 1);
      this.imagesToUpload.splice(index, 1); // Remove corresponding image from imagesToUpload
    }
    this.changeDetectorRef.detectChanges(); // Trigger change detection
  }
  // removeImage(image: any) {
  //   const index = this.uploadedImages.indexOf(image);
  //   const ind = this.imagesToUpload.indexOf(image);
  //   if (index !== -1) {
  //     this.uploadedImages.splice(index, 1);
  //   }
  //   if (ind !== -1) {
  //     this.imagesToUpload.splice(ind, 1);
  //   }
  // }
  uploadImages() {
    this.uploadedImages = [];
  }

  onAmenitySelected() {
    this.showDropdown = false;
  }
  onCategorySelected() {
    this.showEvents = false;
  }
}
