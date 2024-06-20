import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
} from '@angular/forms';

interface Vendor {
  name: string;
  image: string;
  selected: boolean;
}

interface Deliverables {
  name: string;
  image: string;
  selected: boolean;
}
@Component({
  selector: 'app-add-vendor',
  templateUrl: './add-vendor.component.html',
  styleUrls: ['./add-vendor.component.scss'],
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule, ReactiveFormsModule],
})
export class AddVendorComponent implements OnInit {
  vendors: Vendor[] = [];
  deliverables: Deliverables[] = [];
  showDropdown: boolean = false;
  showEmployeeDropdown: boolean = false;
  showDeliverables: boolean = false;
  employeeType: any;
  uploadedImages: any[] = [];
  uploadedthumbnail: any[] = [];
  addVendorForm: FormGroup;
  manageVendor() {
    this.router.navigate(['/vandors']);
  }
  constructor(private router: Router, private formBuilder: FormBuilder) {
    this.addVendorForm = this.formBuilder.group({
      vendorName: [''],
      selectedVendor: [''],
      vendorDescription: [''],
      email: [''],
      address: [''],
      zipCode: [''],
      city: [''],
      contactUs: [''],
    });
  }

  ngOnInit(): void {
    this.vendors = [
      // { name: "DJ", selected: false },
      {
        name: 'Photography',
        image: '../../../../assets/images/icons/dj.png',
        selected: false,
      },
      {
        name: 'Decoration',
        image: '../../../../assets/images/icons/decoration.png',
        selected: false,
      },
      {
        name: 'Music',
        image: '../../../../assets/images/icons/dj.png',
        selected: false,
      },
      {
        name: 'Food',
        image: '../../../../assets/images/icons/rice.png',
        selected: false,
      },
    ];

    this.employeeType = [
      { vendorType: 'Waiter', selected: false },
      { vendorType: 'Cook', selected: false },
      { vendorType: 'Manager', selected: false },
    ];

    this.deliverables = [
      {
        name: 'Video',
        image: '../../../../assets/images/icons/dj.png',
        selected: false,
      },
      {
        name: 'Images',
        image: '../../../../assets/images/icons/dj.png',
        selected: false,
      },
    ];
  }

  toggleDropdown(): void {
    this.showDropdown = !this.showDropdown;
  }

  toggleDeliverables() {
    this.showDeliverables = !this.showDeliverables;
  }

  toggleDropdownEmployee() {
    this.showEmployeeDropdown = !this.showEmployeeDropdown;
  }

  vendorDetails() {
    this.router.navigate(['/vandors/add-vendors-details']);
  }

  onFileSelected(event: any) {
    const files = event.target.files;
    if (files) {
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        const reader = new FileReader();
        reader.onload = (e: any) => {
          this.uploadedImages.push({ name: file.name, url: e.target.result });
        };
        reader.readAsDataURL(file);
      }
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
    if (files && files.length > 0) {
      this.uploadedthumbnail = [];
      const file: File = files[0];
      this.uploadImageAndGetURL(file)
        .then((url: string) => {
          this.uploadedthumbnail.push({ name: file.name, url: url });
          event.target.value = '';
        })
        .catch((error: any) => {
          console.error('Error uploading image:', error);
        });
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

  getSelectedVendorName(): string | undefined {
    const selectedVendors = this.vendors.filter((vendor) => vendor.selected);
    if (selectedVendors.length === 0) {
      return 'Select Vendor Type';
    } else if (selectedVendors.length === 1) {
      return selectedVendors[0].name;
    } else {
      return selectedVendors.map((vendor) => vendor.name).join(', ');
    }
  }

  getDeliverablesName() {
    const selectedDeliverable = this.deliverables.filter(
      (deliverable) => deliverable.selected
    );
    if (selectedDeliverable.length === 0) {
      return 'Select Vendor Type';
    } else if (selectedDeliverable.length === 1) {
      return selectedDeliverable[0].name;
    } else {
      return selectedDeliverable
        .map((deliverable) => deliverable.name)
        .join(', ');
    }
  }

  addUserVendor() {
    const selectedVendorNames = this.vendors
      .filter((vendor) => vendor.selected)
      .map((vendor) => vendor.name);

    console.log('Selected vendor name(s):', selectedVendorNames);

    const selectedEmployeeType = this.deliverables
      .filter((employee: any) => employee.selected)
      .map((employee: any) => employee.name);

    // Log selected employee types
    console.log('Selected employee type(s):', selectedEmployeeType);

    this.addVendorForm.patchValue({
      selectedEmployeeTypes: selectedEmployeeType,
    });

    this.addVendorForm.patchValue({
      selectedVendors: selectedVendorNames,
    });

    console.log('Uploaded images:', this.uploadedImages);

    this.addVendorForm.patchValue({
      uploadedImages: this.uploadedImages,
    });

    console.log('Form value:', this.addVendorForm.value);
  }
}
