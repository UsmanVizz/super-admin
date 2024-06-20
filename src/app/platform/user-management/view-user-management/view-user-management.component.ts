import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  FormControl,
  Validators,
} from '@angular/forms';
import { AllUsersService } from 'src/app/services/all-users.service';
import { environment } from '../../../../environment/environment';
import { UserManagmentService } from 'src/app/services/user-managment.service';
import { SwalService } from 'src/app/services/swal.service';
import { ToastrService } from 'ngx-toastr';
import { first } from 'rxjs/operators';
import { ApiService } from 'src/app/services/api-services.service';

@Component({
  selector: 'app-view-user-management',
  templateUrl: './view-user-management.component.html',
  styleUrls: ['./view-user-management.component.scss'],
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule, ReactiveFormsModule],
})
export class ViewUserManagementComponent implements OnInit {
  uploadedthumbnail: any[] = [];
  userDetail: any;
  endUrl = environment.baseURL;
  userProfileUpdate: FormGroup;
  updated_profile: boolean = false;
  userId: any;
  branches: any[] = [];
  setThumbnail: any;
  designations: any[] = [
    { id: 1, name: 'Branch Manager' },
    { id: 2, name: 'Sale Manager' },
    { id: 3, name: 'Catering Manager' },
    { id: 4, name: 'Decorator' },
    { id: 5, name: 'Cheff' },
    { id: 6, name: 'Front Office Manager' },
    { id: 7, name: 'Housekeeping' },
    { id: 8, name: 'Technician' },
    { id: 9, name: 'Security Manager' },
    { id: 10, name: 'Security Guard' },
    { id: 11, name: 'Accounting Manager' },
  ];
  constructor(
    private router: Router,
    private allUser: AllUsersService,
    private fb: FormBuilder,
    private userService: UserManagmentService,
    private swalService: SwalService,
    private toastr: ToastrService,
    private apiService: ApiService
  ) {
    this.userProfileUpdate = this.fb.group({
      full_name: new FormControl('', [Validators.required]),
      email: new FormControl('', [Validators.required, Validators.email]),
      contact_number: new FormControl('', [Validators.required]),
      role: new FormControl('', [Validators.required]),
      address: new FormControl('', [Validators.required]),
      city: new FormControl('', [Validators.required]),
      state: new FormControl('', [Validators.required]),
      zip_code: new FormControl('', [Validators.required]),
      image: new FormControl('', [Validators.required]),
      salary: new FormControl('', [Validators.required]),
      createdAt: new FormControl(''),
      cnic: new FormControl(''),
      password: new FormControl(''),
      branch_id: new FormControl(''),
      profile_image: [''],
    });
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
    this.allUser.userDetail$.subscribe((userDetail: any) => {
      this.userDetail = userDetail;
      console.log('userDetail', userDetail);
      this.userId = this.userDetail._id;
      console.log(`User ${this.userId}`);
      this.getAllBranches();
      console.log('userDetail', this.userDetail);
    });

    if (this.userDetail === null) {
      this.router.navigate(['/user-management']);
    }
  }

  formatCnic(event: any) {
    const input = event.target.value.replace(/\D/g, '').substring(0, 13);
    const formattedInput = input.replace(/^(\d{5})(\d{7})(\d{1})$/, '$1-$2-$3');
    event.target.value = formattedInput;
  }

  formatPhone(event: any) {
    const input = event.target.value.replace(/\D/g, '').substring(0, 11);
    const formattedInput = input.replace(/^(\d{4})(\d{7})$/, '$1-$2');
    event.target.value = formattedInput;
  }

  formatSalary(event: any) {
    const input = event.target.value.replace(/\D/g, '').substring(0, 7);
    const formattedInput = input.replace(/^(\d{7})$/, '$1');
    event.target.value = formattedInput;
  }

  onThumbnailSelected(event: any): void {
    const files: FileList = event.target.files;
    if (files && files.length > 0) {
      const formData = new FormData();
      formData.append('image', files[0], files[0].name);

      this.userService.getUsersImg(formData).subscribe(
        (res: any) => {
          this.uploadedthumbnail.push(res);
          console.log('Upload successful Thumbnil', res);
          this.setThumbnail = res?.[0]?.url;
          console.log('Upload Thumbnail URL ', this.setThumbnail);
          this.userProfileUpdate.patchValue({
            profile_image: this.setThumbnail,
          });
        },
        (err) => {
          console.error('Error uploading image:', err);
        }
      );
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

  changePassword() {
    this.router.navigate(['hms-main/change-password']);
  }

  toggleUpdateProfile() {
    this.updated_profile = !this.updated_profile;
    if (this.updated_profile) {
      // Create an object to hold the values to patch
      const patchObject: any = {
        full_name: this.userDetail?.full_name,
        email: this.userDetail?.email,
        salary: this.userDetail?.salary,
        role: this.userDetail?.role,
        contact_number: this.userDetail?.phone_no,
        address: this.userDetail?.address?.street_address,
        city: this.userDetail?.city,
        state: this.userDetail?.state,
        zip_code: this.userDetail?.zip_code,
        createdAt: this.userDetail?.joining_date,
        cnic: this.userDetail?.cnic,
        password: this.userDetail?.password,
        branch_id: this.userDetail?.branch_id,
        profile_image: this.userProfileUpdate.value.profile_image,
      };

      // Check if thumbnail is set
      if (this.setThumbnail && this.setThumbnail.length > 0) {
        patchObject.profile_image = this.setThumbnail;
      } else {
        patchObject.profile_image = this.userDetail?.profile_image;
      }

      // Patch the form with the created object
      this.userProfileUpdate.patchValue(patchObject);
    }

    if (!this.updated_profile) {
      this.updateUserProfile();
    }
  }

  personalInfo() {
    this.router.navigate(['hms-main/profile']);
  }

  saveChanges() {
    this.router.navigate(['hms-main/profile']);
  }

  updateUserProfile() {
    if (!this.userId) {
      console.error('User ID is not defined.');
      return;
    }

    const userData = {
      ...this.userProfileUpdate.value,
      _id: this.userId,
    };

    this.userService.updateUsers(this.userId, userData).subscribe(
      (res) => {
        console.log('User profile updated successfully.', res);
        this.swalService.showSuccess('User profile updated successfully.');
        this.router.navigate(['/user-management']);
      },
      (error) => {
        console.error('Error updating user profile:', error);
        this.swalService.showError(error.message);
      }
    );
  }
}
