import {
  Component,
  OnInit,
  QueryList,
  ViewChildren,
  ElementRef,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import {
  FormBuilder,
  Validators,
  FormGroup,
  FormsModule,
  ValidationErrors,
  AbstractControl,
  ReactiveFormsModule,
} from '@angular/forms';
import { environment } from 'src/environment/environment';
import { ApiService } from 'src/app/services/api-services.service';
import { first } from 'rxjs';
import { ToastrService } from 'ngx-toastr';
import { CitiesJson } from 'src/app/services/citiesJson.services';
import { CustomValidators } from 'src/app/shared/custom.validator';
import { ChangeDetectorRef } from '@angular/core';

interface amenity {
  _id: string;
  name: string;
  selected: boolean;
}
@Component({
  selector: 'app-add-branch',
  templateUrl: './add-branch.component.html',
  styleUrls: ['./add-branch.component.scss'],
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule, ReactiveFormsModule],
})
export class AddBranchComponent implements OnInit {
  @ViewChildren('formControl') formControls!: QueryList<ElementRef>;
  imagesToUpload: any[] = [];
  uploadedImages: any[] = [];
  branch_images: any;
  resImages: any[] = [];
  branchForm: FormGroup;
  amenities: amenity[] = [];
  showDropdown: boolean = false;
  data: any;
  floors: [] = [];
  branches: any[] = [];
  pakCityList: any;
  isHall: boolean = false;

  constructor(
    private formBuilder: FormBuilder,
    private apiService: ApiService,
    private router: Router,
    private citiesJson: CitiesJson,
    private toastr: ToastrService,
    private changeDetectorRef: ChangeDetectorRef
  ) {
    this.branchForm = this.formBuilder.group({
      // branch_name: ['', Validators.required],
      branch_name: ['', Validators.required],
      // branch_email: ['', Validators.required],
      branch_email: [
        '',
        [
          Validators.required,
          Validators.email,
          Validators.pattern('^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+.[a-zA-Z]{2,3}$'),
        ],
      ],
      branch_description: ['', Validators.required],
      street_adress: ['', Validators.required],
      total_floors: [''],
      ground_floor_included: [''],
      parking_capacity: [
        '',
        [
          Validators.required,
          Validators.maxLength(3),
          Validators.pattern('^[1-9][0-9]{0,2}$'),
          this.validateParkingCapacity,
        ],
      ],
      // parking_capacity: ['', Validators.required],
      branch_type: ['', Validators.required],
      city: ['', Validators.required],
      // branch_contact: ['', Validators.required],
      branch_contact: [
        '',
        [
          Validators.required,
          Validators.minLength(10),
          Validators.maxLength(13),
          this.validateContactNumber,
        ],
      ],
    });
  }

  ngOnInit(): void {
    this.pakCityList = this.citiesJson.getCities();

    this.getAllAmenities();
  }
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

  /////////

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
          this.apiService.errorToster('Image is larger than 5 MB', 'Error');
          return;
        }
        if (!fileType.startsWith('image/')) {
          this.apiService.errorToster('File Type is not an Image', 'Error');
          return;
        }

        // Generate a unique name for the file
        const uniqueName = this.generateUniqueFileName(file.name);

        const imgDataUrl = this.readFileAsDataURL(file);
        const reader = new FileReader();
        reader.onload = (e: any) => {
          this.uploadedImages.push({ name: uniqueName, url: e.target.result });
        };
        reader.readAsDataURL(file);
        event.target.value = '';
        this.uploadImageToServer(file, uniqueName);
      }
    }
  }

  generateUniqueFileName(fileName: string): string {
    const timestamp = new Date().getTime();
    const randomString = Math.random().toString(36).substring(7);
    const name = fileName.replace(/[^a-z0-9_.]/gi, '_').toLowerCase();
    return `${timestamp}_${randomString}_${name}`;
  }

  private readFileAsDataURL(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  }

  uploadImageToServer(file: File, uniqueName: string) {
    const formData = new FormData();
    formData.append('images', file, uniqueName);

    let url = `${environment.baseURL}/api/hall/branch/upload-images`;
    this.apiService
      .post(url, formData)
      .pipe(first())
      .subscribe(
        (res: any) => {
          console.log('Upload response:', res);
          this.imagesToUpload.push(res.file[0].file_url);
        },
        (error) => {
          console.error('Upload error:', error);
        }
      );
  }

  manageBranch() {
    this.router.navigate(['/branch-manage']);
  }

  // removeImage(image: any) {
  //   const index = this.uploadedImages.indexOf(image);
  //   const ind = this.imagesToUpload.indexOf(image);
  //   if (index !== -1) {
  //     this.uploadedImages.splice(index, 1);
  //   }
  //   if (index !== -1) {
  //     this.imagesToUpload.splice(index, 1);
  //   }
  // }
  // removeImage(image: any): void {
  //   const index: number = this.uploadedImages.indexOf(image);
  //   console.log('log');
  //   if (index !== -1) {
  //     this.uploadedImages.splice(index, 1);

  //     const fileUploadElement: HTMLInputElement | null =
  //       document.getElementById('image-upload') as HTMLInputElement;
  //     if (fileUploadElement) {
  //       fileUploadElement.value = '';
  //     }
  //   }
  // }
  removeImage(image: any): void {
    const index: number = this.uploadedImages.findIndex((img) => img === image);
    if (index !== -1) {
      this.uploadedImages.splice(index, 1);
      this.imagesToUpload.splice(index, 1); // Remove corresponding image from imagesToUpload
    }
    this.changeDetectorRef.detectChanges(); // Trigger change detection
  }

  uploadImages() {
    console.log('Uploading images...');
    console.log(this.uploadedImages);
    this.uploadedImages = [];
  }
  add_branch() {
    if (!this.branchForm.valid) {
      const validationErrors = this.getValidationErrors(this.branchForm);
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
    let payload: any = {
      branch_name: this.branchForm.controls['branch_name'].value,
      branch_email:
        this.branchForm.controls['branch_email'].value.toLowerCase(),
      branch_description: this.branchForm.controls['branch_description'].value,
      address: [
        {
          street_adress: this.branchForm.get('street_adress')?.value,
          city: this.branchForm.get('city')?.value,
        },
      ],
      amenities: selectedAmenities,
      parking_capacity: this.branchForm.controls['parking_capacity'].value,
      floors: {
        total_floors: this.branchForm.get('total_floors')?.value,
        ground_floor_included: this.branchForm.get('ground_floor_included')
          ?.value,
      },
      branch_type: this.branchForm.controls['branch_type'].value,
      branch_contact: this.branchForm.controls['branch_contact'].value,
      images: this.imagesToUpload,
    };
    console.log(payload, 'ground_floor_included');
    try {
      if (this.data) {
        this.updateBranch(payload);
      } else {
        this.createBranch(payload);
      }
    } catch (error) {
      console.error('An error occurred:', error);
    }
  }
  getValidationErrors(form: FormGroup): string[] {
    const errors: string[] = [];
    Object.keys(form.controls).forEach((key) => {
      const controlErrors = form.get(key)?.errors;
      if (controlErrors) {
        Object.keys(controlErrors).forEach((keyError) => {
          let errorMsg = '';
          switch (keyError) {
            case 'required':
              errorMsg = `${key.replace(/_/g, ' ')} is required.`;
              break;
            case 'minlength':
              errorMsg = `${key.replace(/_/g, ' ')} must be at least ${
                controlErrors[keyError].requiredLength
              } characters long.`;
              break;
            case 'maxlength':
              errorMsg = `${key.replace(/_/g, ' ')} must be no more than ${
                controlErrors[keyError].requiredLength
              } characters long.`;
              break;
            case 'invalidEmail':
              errorMsg = `Please enter a valid email address.`;
              break;
            default:
              errorMsg = `${key.replace(/_/g, ' ')} has an error: ${keyError}`;
              break;
          }
          errors.push(errorMsg);
        });
      }
    });
    return errors;
  }
  updateBranch(branch: any) {}

  createBranch(payload: any) {
    let url = `${environment.baseURL}/api/hall/branch/create-branch`;
    this.apiService
      .post(url, payload)
      .pipe(first())
      .subscribe(
        (res: any) => {
          console.log('Response:', res);
          this.apiService.successToster(
            'Branch Created Successfully',
            'Success'
          );
          this.router.navigate(['/branch-manage']);
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

  //validation
  restrictInput(event: KeyboardEvent) {
    const allowedKeys = ['Backspace', 'Delete', 'ArrowLeft', 'ArrowRight'];
    if (event.key.length === 1 && /\D/.test(event.key)) {
      event.preventDefault();
    }
    if (!allowedKeys.includes(event.key) && isNaN(Number(event.key))) {
      event.preventDefault();
    }
  }

  validateContactNumber(control: {
    value: string;
  }): { [key: string]: any } | null {
    const value = control.value;
    if (value && (value.length < 10 || value.length > 13)) {
      return { invalidLength: true };
    }

    return null;
  }

  validateParkingCapacity(control: {
    value: string;
  }): { [key: string]: any } | null {
    const value = control.value;
    if (value && value.length > 3) {
      return { minlength: true };
    }
    return null;
  }
  validateBranchName(control: AbstractControl): { [key: string]: any } | null {
    const value = control.value;

    // Check if value is empty or only spaces
    if (!value || value.trim().length === 0) {
      return { required: true };
    }

    // Check for excessive length
    if (value.length > 30) {
      return { maxLength: true };
    }

    // Check for numbers or repeating characters without spaces
    if (/\d/.test(value) || /^(.)\1+$/.test(value)) {
      return { invalidFormat: true };
    }

    return null;
  }

  emailCorrection() {
    const emailControl = this.branchForm.get('branch_email');

    if (emailControl?.value) {
      const email = emailControl.value;
      const atIndex = email.indexOf('@');

      // Check if '@' exists and it is not the first or last character
      if (atIndex === -1 || atIndex === 0 || atIndex === email.length - 1) {
        emailControl.setErrors({ missingAtSymbol: true });
        return;
      }

      const domain = email.substring(atIndex + 1);
      const allowedDomains = [
        'gmail.com',
        'gmail.net',
        'gmail.org',
        'gmail.co',
        'gmail.info',
        'gmail.biz',
        'yahoo.com',
        'yahoo.net',
        'yahoo.org',
        'yahoo.co',
        'yahoo.info',
        'yahoo.biz',
        'yopmail.com',
        'yopmail.net',
        'yopmail.org',
        'yopmail.co',
        'yopmail.info',
        'yopmail.biz',
      ];

      // Check if the domain is in the allowed list
      if (!allowedDomains.includes(domain)) {
        emailControl.setErrors({ invalidDomain: true });
      } else {
        emailControl.setErrors(null);
      }
    }
  }

  getEmailErrorMessage() {
    const branchEmailControl = this.branchForm.get('branch_email');

    if (branchEmailControl?.hasError('email')) {
      return 'Please enter a valid email address.';
    }

    if (branchEmailControl?.hasError('missingAtSymbol')) {
      return 'Email address should contain the @ symbol.';
    }

    if (branchEmailControl?.hasError('invalidDomain')) {
      return 'Email address should be(gmail, yahoo, yopmail with valid extensions)';
    }

    return '';
  }

  onBranchTypeChange(event: Event): void {
    const selectedValue = (event.target as HTMLSelectElement).value;
    if (selectedValue === 'hall') {
      this.isHall = true;
    } else {
      this.isHall = false;
    }
  }
  onAmenitySelected() {
    this.showDropdown = false;
  }
}
