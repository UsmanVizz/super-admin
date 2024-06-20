import {
  Component,
  OnInit,
  QueryList,
  ViewChildren,
  ElementRef,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import Swal from 'sweetalert2';
import {
  FormBuilder,
  Validators,
  FormGroup,
  FormsModule,
  ValidationErrors,
  ReactiveFormsModule,
  AbstractControl,
} from '@angular/forms';
import { environment } from 'src/environment/environment';
import { ApiService } from 'src/app/services/api-services.service';
import { first } from 'rxjs';
import { ToastrService } from 'ngx-toastr';
import { CitiesJson } from 'src/app/services/citiesJson.services';
import { ActivatedRoute } from '@angular/router';
interface amenity {
  _id: string;
  name: string;
  selected: boolean;
}
@Component({
  selector: 'app-edit-branch',
  templateUrl: './edit-branch.component.html',
  styleUrls: ['./edit-branch.component.scss'],
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule, ReactiveFormsModule],
})
export class EditBranchComponent implements OnInit {
  @ViewChildren('formControl') formControls!: QueryList<ElementRef>;
  imagesToUpload: any[] = [];
  uploadedImages: any[] = [];
  branch_images: any;
  branchForm: FormGroup;
  data: any;
  newData: any;
  branchData: any;
  amenities: amenity[] = [];
  resImages: any[] = [];
  pakCityList: any;
  isHall: boolean = false;
  showDropdown: boolean = false;

  constructor(
    private formBuilder: FormBuilder,
    private apiService: ApiService,
    private router: Router,
    private toastr: ToastrService,
    private citiesJson: CitiesJson,
    private routes: ActivatedRoute
  ) {
    this.branchForm = this.formBuilder.group({
      amenities: [''],

      branch_name: ['', Validators.required],

      branch_email: ['', [Validators.required, this.emailCorrection]],
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

      branch_type: ['', Validators.required],
      city: ['', Validators.required],

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
  manageBranch() {
    this.router.navigate(['/branch-manage']);
  }
  ngOnInit(): void {
    this.pakCityList = this.citiesJson.getCities();

    this.getAllAmenities();
    this.routes.params.subscribe((params) => {
      const id = params['id'];
      console.log('Branch ID:', id);
      this.getBranchData(id);
    });
    const initialBranchType = this.branchForm.get('branch_type')?.value;
    this.setHallFlag(initialBranchType);

    // Subscribe to value changes to update the view dynamically
    this.branchForm.get('branch_type')?.valueChanges.subscribe((value) => {
      this.setHallFlag(value);
    });
  }

  getBranchData(id: any) {
    const url = new URL(`${environment.baseURL}/api/hall/branch/branch/${id}`);
    this.apiService
      .get(url.href)
      .pipe(first())
      .subscribe(
        (response: any) => {
          const branchData = response.branch;
          console.log(branchData, 'branchData');
          this.branchData = branchData;
          this.uploadedImages = branchData.images ? branchData.images : [];

          if (branchData) {
            this.branchForm.patchValue({
              branch_name: branchData.branch_name,
              branch_email: branchData.branch_email,
              branch_description: branchData.branch_description,
              amenities: branchData.amenities,
              parking_capacity: branchData.parking_capacity,

              // floors: {
              //   total_floors: this.branchForm.get('total_floors')?.value,
              //   ground_floor_included: this.branchForm.get(
              //     'ground_floor_included'
              //   )?.value,
              // },
              // total_floors: branchData.floors,
              total_floors: branchData.floors.total_floors,
              ground_floor_included: branchData.floors.ground_floor_included,
              branch_type: branchData.branch_type,

              street_adress:
                branchData.address && branchData.address.length > 0
                  ? branchData.address[0].street_adress
                  : '',

              city:
                branchData.address && branchData.address.length > 0
                  ? branchData.address[0].city
                  : '',

              branch_contact: branchData.branch_contact,
            });

            this.branchForm.markAsPristine();
            this.branchForm.markAsUntouched();
          }
          this.amenities.forEach((amenity) => {
            amenity.selected = branchData.amenities.includes(amenity._id);
          });
        },
        (error) => {
          console.error('Error fetching branch data:', error);
        }
      );
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
          console.log(' this.amenities', this.amenities);
        },

        (error) => {
          console.error('Error fetching amenities:', error);
        }
      );
  }
  private readFileAsDataURL(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  }
  updateBranch(id?: any): void {
    if (!this.branchForm.valid) {
      const validationErrors = this.getValidationErrors(this.branchForm);

      // Add validation errors as HTML to the toast message
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

      // Scroll to the first invalid control
      this.scrollToFirstInvalidControl();

      return;
    }

    const imageUrls = this.uploadedImages.map((image) => image.url);
    const url = `${environment.baseURL}/api/hall/branch/branch/${id}`;

    const newData = this.branchForm.value;
    newData.address = [
      {
        street_adress: newData.street_adress,
        city: newData.city,
      },
    ];
    newData.floors = {
      total_floors: newData.total_floors,
      ground_floor_included: newData.ground_floor_included,
    };
    newData.images = this.uploadedImages;
    this.apiService
      .put(url, newData)
      .pipe(first())
      .subscribe(
        (response) => {
          console.log('Branch updated successfully:', response);
          this.apiService.successToster(
            'Branch Updated Successfully',
            'Success'
          );
          this.router.navigate(['/branch-manage']);
        },
        (error) => {
          console.error('Error updating branch:', error);
          this.apiService.errorToster(error.error['message'], 'Error');
        }
      );
  }
  scrollToFirstInvalidControl() {
    const firstInvalidControl: HTMLElement = this.formControls.find(
      (formControl: any) => !formControl.nativeElement.checkValidity()
    )?.nativeElement;

    if (firstInvalidControl) {
      firstInvalidControl.scrollIntoView({ behavior: 'smooth' });
      firstInvalidControl.focus();
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

  onFileSelected(event: any) {
    const fileList: FileList = event.target.files;
    if (fileList.length === 0) {
      return;
    }

    const file: File = fileList[0]; // Assuming single file upload

    const fileSizeKB = file.size / 1024;
    const fileType = file.type;

    if (fileSizeKB >= 5000) {
      this.apiService.errorToster('Image is larger than 5 MB', 'Error');
      return;
    }

    if (!fileType.startsWith('image/')) {
      this.apiService.errorToster('File type is not an image', 'Error');
      return;
    }
    // Generate a unique name for the file
    const uniqueName = this.generateUniqueFileName(file.name);
    const reader = new FileReader();
    reader.onload = (e: any) => {
      const imageData = { name: file.name, url: e.target.result };
      // this.uploadedImages.push(imageData);

      // Update form control value with new image URL
      const imageControl = this.branchForm.get('image');
      if (imageControl) {
        const images = imageControl.value || [];
        images.push(e.target.result);
        imageControl.setValue(images);
      }
      event.target.value = '';
      // Upload image to server
      this.uploadImageToServer(file, uniqueName);
    };
    reader.readAsDataURL(file);
  }
  generateUniqueFileName(fileName: string): string {
    const timestamp = new Date().getTime();
    const randomString = Math.random().toString(36).substring(7);
    const name = fileName.replace(/[^a-z0-9_.]/gi, '_').toLowerCase();
    return `${timestamp}_${randomString}_${name}`;
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

          // Update uploadedImages with correct URL
          let imageData = res.file[0].file_url; // Assuming response structure
          this.uploadedImages.push(imageData);
          // Update form control value with new image URL
          const imageControl = this.branchForm.get('image');
          if (imageControl) {
            const images = imageControl.value || [];
            images.push(res.file[0].file_url);
            imageControl.setValue(images);
          }
        },
        (error) => {
          console.error('Upload error:', error);
        }
      );
  }
  removeImage(image: any) {
    const index = this.uploadedImages.indexOf(image);
    if (index !== -1) {
      this.uploadedImages.splice(index, 1);
      console.log('remove image');
      // Update form control value
      const imageControl = this.branchForm.get('image');
      if (imageControl) {
        const images = imageControl.value || [];
        const imageIndex = images.indexOf(image.url);
        if (imageIndex !== -1) {
          images.splice(imageIndex, 1);
          imageControl.setValue(images);
          console.log('remove control value image');
        }
      }
    }
  }
  uploadImages() {
    console.log('Uploading images...');
    console.log(this.uploadedImages);
    this.uploadedImages = [];
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

  // Function to check if description contains meaningful content
  isValidDescriptionFormat(description: string): boolean {
    // Remove extra spaces and split into words
    const words = description.trim().split(/\s+/);

    // Check if all words are identical
    const firstWord = words[0];
    const allIdentical = words.every((word) => word === firstWord);

    // Check for repeating characters
    const hasRepeatingCharacters = words.some((word) => /(.)\1{2,}/.test(word));

    return !(words.length === 1 && allIdentical) && !hasRepeatingCharacters;
  }

  emailCorrection(control: { value: string }): { [key: string]: any } | null {
    const value = control.value;
    if (value) {
      // Regular expression for validating email
      const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

      if (!emailRegex.test(value)) {
        return { invalidEmail: true };
      }
    }
    return null;
  }

  getEmailErrorMessage() {
    const branchEmailControl = this.branchForm.get('branch_email');

    if (branchEmailControl?.hasError('required')) {
      return 'Email is required.';
    }

    if (branchEmailControl?.hasError('invalidEmail')) {
      return 'Please enter a valid email address.';
    }

    return '';
  }
  setHallFlag(selectedValue: string): void {
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
