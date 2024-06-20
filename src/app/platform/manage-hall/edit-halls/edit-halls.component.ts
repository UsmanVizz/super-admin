import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import Swal from 'sweetalert2';
import {
  FormBuilder,
  Validators,
  FormsModule,
  AbstractControl,
  FormArray,
  FormGroup,
  ValidationErrors,
  ReactiveFormsModule,
} from '@angular/forms';
import { environment } from 'src/environment/environment';
import { ApiService } from 'src/app/services/api-services.service';
import { Observable, first, forkJoin } from 'rxjs';
import { CitiesJson } from 'src/app/services/citiesJson.services';
import { ActivatedRoute } from '@angular/router';
import { ToastrService, IndividualConfig } from 'ngx-toastr';
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
@Component({
  selector: 'app-edit-halls',
  templateUrl: './edit-halls.component.html',
  styleUrls: ['./edit-halls.component.scss'],
  standalone: true,
  imports: [CommonModule, RouterModule, ReactiveFormsModule, FormsModule],
})
export class EditHallsComponent implements OnInit {
  title: string;
  description: string;
  uploadedImages: any[] = [];
  imagesToUpload: any[] = [];
  branches: any;
  showEvents: boolean = false;
  cardData: any;
  hallForm: FormGroup;
  data: any;
  amenities: amenity[] = [];
  pakCityList: any;
  showDropdown: boolean = false;
  categories: category[] = [];
  selectedBranch: any;
  floors: number[] = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

  allbranches: any[] = [];
  allamenities: any[] = [];
  allcategories: any[] = [];

  manageHall() {
    this.router.navigate(['/hall-manage']);
  }
  toastrConfig: Partial<IndividualConfig> = {
    timeOut: 2000, // Set the timeout to 2000ms (2 seconds)
    closeButton: true,
    positionClass: 'toast-top-right',
  };
  constructor(
    private formBuilder: FormBuilder,
    private apiService: ApiService,
    private router: Router,
    private citiesJson: CitiesJson,
    private routes: ActivatedRoute,
    private toastr: ToastrService
  ) {
    this.title = '';
    this.description = '';
    this.hallForm = this.formBuilder.group({
      hall_title: ['', Validators.required],
      people_capacity: ['', Validators.required],
      hall_description: ['', Validators.required],
      floor: [''],
      ground_floor_included: [false],
      rent: ['', Validators.required],
      branch: ['', Validators.required],
      hall_contact: ['', Validators.required],
      city: ['', Validators.required],
      hall_area: ['', Validators.required],
      amenities: [[]],
      event_type: [],
      attraction: [''],
      street_adress: ['', Validators.required],
    });
    this.hallForm
      .get('ground_floor_included')
      ?.valueChanges.subscribe((value) => {
        if (value) {
          this.hallForm.get('floor')?.setValue(''); // Set floor field to empty
          this.hallForm.get('floor')?.disable(); // Disable floor dropdown
          this.toastr.warning(
            'Ground floor is selected. No other floor can be selected.',
            'Floor Alert'
          );
        } else {
          if (
            this.selectedBranch &&
            this.selectedBranch.branch_type === 'hall'
          ) {
            this.hallForm.get('floor')?.enable(); // Enable floor dropdown if branch is of type 'hall'
          } else {
            this.hallForm.get('floor')?.disable(); // Disable floor dropdown if branch is not of type 'hall'
            this.hallForm.get('floor')?.setValue(''); // Clear floor field
          }
        }
      });
    // this.hallForm
    //   .get('ground_floor_included')
    //   ?.valueChanges.subscribe((value) => {
    //     if (value) {
    //       this.hallForm.get('floor')?.setValue(''); // Set floor field to empty
    //       this.hallForm.get('floor')?.disable(); // Disable floor dropdown
    //       this.toastr.warning(
    //         'You can select one floor (ground floor or from dropdown)',
    //         'Floor Alert',
    //         this.toastrConfig
    //       );
    //     } else {
    //       this.hallForm.get('floor')?.enable(); // Enable floor dropdown
    //     }
    //   });
  }

  ngOnInit(): void {
    this.getAllBranches();
    this.getAllAmenities();
    this.getAllCategories();
    this.pakCityList = this.citiesJson.getCities();

    this.routes.params.subscribe((params) => {
      const id = params['id'];
      console.log('Hall ID:', id);
      setTimeout(() => {
        this.getHallData(id);
      }, 2000);
    });
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
      this.branches.find((branch: any) => branch._id === branchId) || null;
    console.log('selected branch', this.selectedBranch);

    if (this.selectedBranch) {
      this.populateFloors();
      this.hallForm.patchValue({
        ground_floor_included: this.selectedBranch.ground_floor_included,
        floor: this.selectedBranch.total_floors,
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
            amenities_info: amenity.amenities_info,
            selected: false,
          }));
        },
        (error) => {
          console.error('Error fetching amenities:', error);
        }
      );
  }
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
  getHallData(id: any) {
    let url = new URL(
      `${environment.baseURL}/api/hall/sub-hall/sub-hall/${id}`
    );

    this.apiService
      .get(url.href)
      .pipe(first())
      .subscribe(
        (response: any) => {
          const cardData = response.subHall;
          this.cardData = cardData;
          console.log('cardData', cardData);
          this.uploadedImages = cardData.images ? cardData.images : [];
          if (cardData) {
            this.hallForm.patchValue({
              hall_title: cardData.hall_title,
              people_capacity: cardData.people_capacity,
              hall_description: cardData.hall_description,
              floor: cardData.floor,
              amenities: cardData.amenities,
              event_type: cardData.event_type,
              rent: cardData.rent,
              street_adress:
                cardData.address && cardData.address.length > 0
                  ? cardData.address[0].street_adress
                  : '',

              city:
                cardData.address && cardData.address.length > 0
                  ? cardData.address[0].city
                  : '',

              branch: cardData.branch,

              hall_contact: cardData.hall_contact,

              hall_area: cardData.hall_area,
              attraction: cardData.attraction,
            });
            console.log('Updated categories:', this.cardData.event_type);
            console.log('Updated categories:', this.categories);
            let dt = this.cardData.event_type;
            this.categories.forEach((ele: any) => {
              dt.forEach((elem: any) => {
                if (ele._id === elem) {
                  ele.selected = true;
                }
              });
            });
            // this.categories.forEach((ele: any) => {
            //   console.log('ele', ele);
            //   // this.cardData.event_type.forEach((elem: any) => {
            //   // console.log('elem', elem);
            //   // if (ele._id === elem) {
            //   //   ele.selected = true;
            //   // } else {
            //   //   ele.selected = false;
            //   // }
            //   // });
            // });
            // this.categories.forEach((category) => {
            //   category.selected =
            //     this.cardData.event_type &&
            //     this.cardData.event_type.includes(category._id);
            // });
            console.log('Updated categories:', this.categories);

            this.hallForm.markAsPristine();
            this.hallForm.markAsUntouched();
          }
          this.amenities.forEach((amenity) => {
            amenity.selected = cardData.amenities.includes(amenity._id);
          });
        },
        (error) => {
          console.error('Error fetching branch data:', error);
        }
      );
  }
  logValidationErrors(group: FormGroup = this.hallForm): void {
    Object.keys(group.controls).forEach((key: string) => {
      const control = group.get(key);
      if (control instanceof FormGroup) {
        this.logValidationErrors(control);
      } else {
        if (control && !control.valid) {
          console.log(`Control: ${key}, Error: `, control.errors);
        }
      }
    });
  }
  // updateHall(id?: any): void {
  //   if (!this.hallForm.valid) {
  //     // Get detailed validation errors
  //     const validationErrors = this.getValidationErrors(this.hallForm);

  //     Swal.fire({
  //       icon: 'error',
  //       title: 'Error',
  //       text: 'Please check all input fields and ensure the form is valid.',
  //       html: `
  //       <ul style="list-style-type: none; padding: 0;">
  //         ${validationErrors.map((error) => `<li>${error}</li>`).join('')}
  //       </ul>`,
  //     });

  //     return;
  //   }

  //   const imageUrls = this.uploadedImages.map((image) => image.url);
  //   const url = `${environment.baseURL}/api/hall/sub-hall/sub-hall/${id}`;
  //   // const selectedCategories = this.categories
  //   //   .filter((category) => category.selected)
  //   //   .map((category) => category._id);

  //   const newData = {
  //     ...this.hallForm.value,
  //     // event_type: selectedCategories,
  //   };
  //   // console.log('selectedCategories', selectedCategories);
  //   newData.address = [
  //     {
  //       street_adress: newData.street_adress,
  //       city: newData.city,
  //     },
  //   ];

  //   newData.images = this.uploadedImages;
  //   this.apiService
  //     .put(url, newData)
  //     .pipe(first())
  //     .subscribe(
  //       (response) => {
  //         console.log('Hall updated successfully:', response);
  //         this.apiService.successToster('Hall Updated Successfully', 'Success');
  //         this.router.navigate(['/hall-manage']);
  //       },
  //       (error) => {
  //         console.error('Error updating Hall:', error);
  //         this.apiService.errorToster(error.error['message'], 'Error');
  //       }
  //     );
  // }
  updateHall(id?: any): void {
    if (!this.hallForm.valid) {
      // Get detailed validation errors
      const validationErrors = this.getValidationErrors(this.hallForm);

      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Please check all input fields and ensure the form is valid.',
        html: `
        <ul style="list-style-type: none; padding: 0;">
          ${validationErrors.map((error) => `<li>${error}</li>`).join('')}
        </ul>`,
      });

      return;
    }

    const imageUrls = this.uploadedImages.map((image) => image.url);
    const url = `${environment.baseURL}/api/hall/sub-hall/sub-hall/${id}`;

    // Prepare form data
    const newData = {
      ...this.hallForm.value,
      images: this.uploadedImages,
      address: [
        {
          street_adress: this.hallForm.value.street_adress,
          city: this.hallForm.value.city,
        },
      ],
      event_type: this.categories
        .filter((category) => category.selected)
        .map((category) => category._id),
    };

    this.apiService
      .put(url, newData)
      .pipe(first())
      .subscribe(
        (response) => {
          console.log('Hall updated successfully:', response);
          this.apiService.successToster('Hall Updated Successfully', 'Success');
          this.router.navigate(['/hall-manage']);
        },
        (error) => {
          console.error('Error updating Hall:', error);
          this.apiService.errorToster(error.error['message'], 'Error');
        }
      );
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
      floor: {
        required: 'floor is required.',
      },
      amenities: {
        required: 'amenities is required.',
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

  createHall(data: any) {
    let url = new URL(`${environment.baseURL}/api/hall/sub-hall/sub-halls`);
    this.apiService
      .post(url.href, data)
      .pipe(first())
      .subscribe(
        (res: any) => {
          this.apiService.successToster('Hall Created Successfully', 'Success');
          this.router.navigate(['/hall-manage']);
        },
        (err: any) => {
          this.apiService.errorToster(err.error['message'], 'Error');
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

    const formData = new FormData();
    const uniqueFileName = `${Date.now()}-${file.name}`;
    formData.append('images', file, uniqueFileName);

    // Clear the file input field to avoid caching issues
    event.target.value = '';

    // Upload image to server
    this.uploadImageToServer(formData, uniqueFileName);
  }

  uploadImageToServer(formData: FormData, fileName: string) {
    let url = `${environment.baseURL}/api/hall/branch/upload-images`;
    this.apiService.post(url, formData).subscribe(
      (res: any) => {
        // Update uploadedImages with correct URL
        let imageData = res.file[0].file_url; // Assuming response structure
        this.uploadedImages.push(imageData);

        // Update form control value with new image URL
        const imageControl = this.hallForm.get('images');
        if (imageControl) {
          const images = imageControl.value || [];
          images.push(imageData);
          imageControl.setValue(images);
        }
      },
      (error) => {
        console.error('Upload error:', error);
        this.apiService.errorToster('Upload failed', 'Error');
      }
    );
  }
  // onFileSelected(event: any) {
  //   const fileList: FileList = event.target.files;
  //   if (fileList.length === 0) {
  //     return;
  //   }

  //   const file: File = fileList[0]; // Assuming single file upload

  //   const fileSizeKB = file.size / 1024;
  //   const fileType = file.type;

  //   if (fileSizeKB >= 5000) {
  //     this.apiService.errorToster('Image is larger than 5 MB', 'Error');
  //     return;
  //   }

  //   if (!fileType.startsWith('image/')) {
  //     this.apiService.errorToster('File type is not an image', 'Error');
  //     return;
  //   }

  //   const reader = new FileReader();
  //   reader.onload = (e: any) => {
  //     const imageData = { name: file.name, url: e.target.result };
  //     // this.uploadedImages.push(imageData);

  //     // Update form control value with new image URL
  //     const imageControl = this.hallForm.get('image');
  //     if (imageControl) {
  //       const images = imageControl.value || [];
  //       images.push(e.target.result);
  //       imageControl.setValue(images);
  //     }

  //     // Upload image to server
  //     this.uploadImageToServer(file);
  //   };
  //   reader.readAsDataURL(file);
  // }
  // uploadImageToServer(file: File) {
  //   const formData = new FormData();
  //   formData.append('images', file);

  //   let url = `${environment.baseURL}/api/hall/branch/upload-images`;
  //   this.apiService
  //     .post(url, formData)
  //     .pipe(first())
  //     .subscribe(
  //       (res: any) => {
  //         // Update uploadedImages with correct URL
  //         let imageData = res.file[0].file_url; // Assuming response structure
  //         this.uploadedImages.push(imageData);
  //         // Update form control value with new image URL
  //         const imageControl = this.hallForm.get('image');
  //         if (imageControl) {
  //           const images = imageControl.value || [];
  //           images.push(res.file[0].file_url);
  //           imageControl.setValue(images);
  //         }
  //       },
  //       (error) => {
  //         console.error('Upload error:', error);
  //       }
  //     );
  // }
  private readFileAsDataURL(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  }

  removeImage(image: any) {
    const index = this.uploadedImages.indexOf(image);
    const ind = this.imagesToUpload.indexOf(image);
    if (index !== -1) {
      this.uploadedImages.splice(index, 1);
    }
    if (ind !== -1) {
      this.imagesToUpload.splice(ind, 1);
    }
  }

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
