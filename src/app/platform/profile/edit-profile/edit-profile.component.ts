import { ApiService } from 'src/app/services/api-services.service';
import { first } from 'rxjs';
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { AuthServiceService } from 'src/app/services/auth-service.service';
import { Title } from '@angular/platform-browser';
import { environment } from '../../../../environment/environment';
import { UserManagmentService } from 'src/app/services/user-managment.service';
import { ToastrService } from 'ngx-toastr';
import { HttpClient } from '@angular/common/http'; // Import HttpClient
import { UserProfileService } from 'src/app/services/user-profile.service';
import { SwalService } from 'src/app/services/swal.service';

@Component({
  selector: 'app-edit-profile',
  templateUrl: './edit-profile.component.html',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule, ReactiveFormsModule],
  styleUrls: ['./edit-profile.component.scss'],
})
export class EditProfileComponent implements OnInit {
  uploadedthumbnail: any[] = [];
  profileData: any;
  setThumbnail: string | null = null;
  endUrl = environment.baseURL;
  updated_profile: boolean = false;
  defaultImage: string =
    '../../../../assets/images/profiles/no-image-default.jpg';

  userProfileUpdate: FormGroup;

  constructor(
    private router: Router,
    private authService: AuthServiceService,
    private fb: FormBuilder,
    private title: Title,
    private toastr: ToastrService,
    private apiService: ApiService,
    private userService: UserManagmentService,
    private userProfileService: UserProfileService,
    private swalService: SwalService
  ) {
    this.userProfileUpdate = this.fb.group({
      email: new FormControl('', [Validators.required, Validators.email]),
      business_location: new FormControl(''),
      business_contact_number: new FormControl(''),
      cnic: new FormControl(''),
      zip_code: new FormControl(''),
      address: new FormControl(''),
      phone_no: new FormControl(''),
    });
  }
  formatCnic(event: any) {
    const input = event.target.value.replace(/\D/g, '').substring(0, 13);
    const formattedInput = input.replace(/^(\d{5})(\d{7})(\d{1})$/, '$1-$2-$3');
    event.target.value = formattedInput;
  }

  formatPhone(event: any) {
    const input = event.target.value.replace(/\D/g, '').substring(0, 11);
    const formattedInput = input.replace(/^(\d{4})(\d{7})$/, '$1 $2');
    event.target.value = formattedInput;
  }

  formatZipCode(event: any) {
    const input = event.target.value.replace(/\D/g, '').substring(0, 5);
    const formattedInput = input.replace(/^(\d{5})$/, '$1 ');
    event.target.value = formattedInput;
  }
  ngOnInit(): void {
    this.getProfileData();
  }
  changePassword() {
    this.router.navigate(['/profile/change-password']);
  }

  personalInfo() {
    this.router.navigate(['profile']);
  }
  // saveChanges() {
  //   this.router.navigate(['profile']);
  // }
  getProfileData() {
    const url = new URL(`${environment.baseURL}/api/hall/profile/get-profile`);
    this.apiService
      .get(url.href)
      .pipe(first())
      .subscribe(
        (response: any) => {
          const profileData = response.data?.data;

          this.profileData = profileData;
          console.log(this.profileData, ' this.profileData ');
          this.updateFormControls();
        },
        (error) => {
          console.error('Error fetching branch data:', error);
        }
      );
  }

  updateFormControls() {
    if (!this.profileData) {
      console.log('Profile data not available');
      return;
    }
    console.log(' this.profileData', this.profileData);
    const formData = {
      full_name: this.profileData?.full_name || '',
      email: this.profileData?.email || '',
      business_location: this.profileData?.address || '',
      business_contact_number: this.profileData?.business_contact_number || ' ',
      cnic: this.profileData?.cnic || '',
      zip_code: this.profileData?.zip_code || ' ',
      address: this.profileData?.address || '',
      phone_no: this.profileData?.phone_no || '',
    };

    console.log('Form Data to Patch:', formData); // Debugging

    this.userProfileUpdate.patchValue(formData);
  }

  onThumbnailSelected(event: any): void {
    const files: FileList = event.target.files;
    if (files && files.length > 0) {
      const formData = new FormData();
      formData.append('image', files[0], files[0].name);

      // Simple API call
      this.userService.updateUserDp(formData).subscribe(
        (res: any) => {
          this.uploadedthumbnail.push(res);
          // console.log("Upload successful Thumbnil", res);
          this.setThumbnail = res?.data?.logo_image;
          // console.log("Upload Thumbnail URL ", this.setThumbnail);
        },
        (err) => {
          console.error('Error uploading image:', err);
        }
        // this.http.post<any>(`${this.endUrl}/updateUserDp`, formData).subscribe(
        //   (res: any) => {
        //     this.uploadedthumbnail.push(res);
        //     this.setThumbnail = res?.data?.logo_image;
        //   },
        //   (err) => {
        //     console.error('Error uploading image:', err);
        //   }
      );
    }
  }

  removeThumbnail(image: any): void {
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

  toggleUpdateProfile() {
    this.updated_profile = !this.updated_profile;

    this.updateProfile();
  }

  updateProfile() {
    const updatedData = {
      ...this.userProfileUpdate.value,
      logo_image: this.setThumbnail || this.profileData.logo_image,
    };

    this.authService.updateUserDetails(updatedData).subscribe(
      (res) => {
        this.swalService.showSuccess('Profile Updated Successfully');
        this.getProfileData();
        this.userProfileService.notifyProfileUpdated();
        this.router.navigate(['profile']);
      },
      (err) => {
        console.log(err);
        this.swalService.showError(err.error.message);
      }
    );
  }
}
