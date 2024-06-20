import { CommonModule } from '@angular/common';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  FormControl,
  Validators,
} from '@angular/forms';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { environment } from '../../../../environment/environment';
import { UserManagmentService } from 'src/app/services/user-managment.service';
import { SwalService } from 'src/app/services/swal.service';
import { ToastrService } from 'ngx-toastr';
import { AllUsersService } from 'src/app/services/all-users.service';
import { first } from 'rxjs/operators';
import { ApiService } from 'src/app/services/api-services.service';

@Component({
  selector: 'app-edit-employee',
  templateUrl: './edit-employee.component.html',
  styleUrls: ['./edit-employee.component.scss'],
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
})
export class EditEmployeeComponent implements OnInit {
  uploadedthumbnail: any[] = [];
  userDetail: any;
  endUrl = environment.baseURL;
  userProfileUpdate: FormGroup;
  updated_profile: boolean = false;
  userId: any;
  setThumbnail: any;
  avatar: any;
  avatar_url: any;
  imageToUpload: any;
  branches: any[] = [];
  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private userService: UserManagmentService,
    private allUser: AllUsersService,
    private swalService: SwalService,
    private toastr: ToastrService,
    private apiService: ApiService
  ) {
    this.userProfileUpdate = this.fb.group({
      full_name: ['', [Validators.required, Validators.min(8)]],
      email: new FormControl('', [Validators.required, Validators.email]),
      cnic: new FormControl('', [Validators.required]),
      phone_no: new FormControl('', [Validators.required]),
      salary: new FormControl('', [Validators.required]),
      joining_date: new FormControl(''),
      role: new FormControl('', [Validators.required]),
      street_address: ['', Validators.required],
      password: new FormControl(''),
      profile_image: [''],
      branch_id: new FormControl(''),
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
  ngOnInit(): void {
    this.allUser.userDetail$.subscribe((userDetail: any) => {
      this.userDetail = userDetail;
      this.userId = this.userDetail?._id;
      console.log(`User ${this.userId}`);
      this.getAllBranches();
      console.log('userDetail', this.userDetail);

      // Set initial form values if userDetail is not null
      if (this.userDetail) {
        this.setFormValues();
      } else {
        this.router.navigate(['/user-management']);
      }
    });
  }
  formatDate(date: Date): string {
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  }
  clearThumbnail() {
    this.setThumbnail = null; // Clear the thumbnail
  }

  profile: any = {
    profile_image: '../../../../assets/dashboard/default-image.webp',
  };
  setFormValues(): void {
    this.userProfileUpdate.patchValue({
      full_name: this.userDetail.full_name,
      email: this.userDetail.email,
      cnic: this.userDetail.cnic,
      phone_no: this.userDetail.phone_no,
      salary: this.userDetail.salary,
      joining_date: this.formatDate(new Date(this.userDetail.joining_date)),
      // joining_date: this.formatDate(new Date(this.userDetail.joining_date)),
      role: this.userDetail.role,
      street_address: this.userDetail?.address?.street_address || '',
      profile_image: this.userDetail.profile_image || '', // Update profile_image field

      password: this.userDetail.password,

      branch_id: this.userDetail.branch_id,
    });
    console.log(' this.userDetail.joining_date', this.userDetail.branch_id);
    this.setThumbnail = this.userDetail.profile_image;
    console.log(' this.setThumbnail ', this.setThumbnail);
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
          console.log('Upload successful Thumbnail', res);
          this.setThumbnail = res?.[0]?.url;
          console.log('Upload Thumbnail URL ', this.setThumbnail);
          this.userProfileUpdate.patchValue({
            profile_image: this.setThumbnail,
          });

          event.target.value = '';
        },
        (err) => {
          console.error('Error uploading image:', err);
        }
      );
    }
  }

  removeThumbnail(): void {
    this.setThumbnail = null;
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

  toggleUpdateProfile() {
    this.updated_profile = !this.updated_profile;
    if (this.updated_profile) {
      const patchObject: any = {
        full_name: this.userDetail?.full_name,
        email: this.userDetail?.email,
        salary: this.userDetail?.salary,
        role: this.userDetail?.role,
        phone_no: this.userDetail?.phone_no,
        street_address: this.userDetail?.address?.street_address,
        password: this.userDetail?.password,
        branch_id: this.userDetail?.branch_id,
        // createdAt: this.userDetail?.joining_date,
        joining_date: this.userDetail.joining_date,
        profile_image: this.userProfileUpdate.value.profile_image,
      };
      console.log('street_address', this.userDetail?.joining_date);
      if (this.setThumbnail && this.setThumbnail.length > 0) {
        patchObject.profile_image = this.setThumbnail;
      } else {
        patchObject.profile_image = this.userDetail?.profile_image;
      }

      this.userProfileUpdate.patchValue(patchObject);
      console.log('update');
    }
  }

  updateUserProfile() {
    if (!this.userId) {
      console.error('User ID is not defined.');
      return;
    }

    const userData = {
      address: {
        street_address: this.userProfileUpdate.value.street_address,
      },
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
  /********************************* */
  removeImage() {
    this.avatar_url = null;

    this.avatar = null;
    // this.notImage = false;
    // this.imageRemoved = true;
  }

  async fileChange(event: any) {
    const fileList: FileList = event.target.files;
    if (fileList.length === 0) {
      return;
    }
    const file: File = fileList[0];
    const fileSizeKB = file.size / 1024;
    const fileType = file.type;
    if (fileSizeKB >= 5000) {
      this.apiService.infoToster(
        'Warning: File size should be less than 5MB',
        'Info'
      );
      return;
    }
    if (!fileType.startsWith('image/')) {
      this.apiService.infoToster('File Type is not an Image', 'Info');
      return;
    }
    try {
      // this.notImage = false;
      this.avatar = file;
      this.uploadImage();

      this.avatar_url = ' ';
      const imgDataUrl = await this.readFileAsDataURL(file);
      console.log('image', this.avatar);
      this.avatar_url = imgDataUrl; // Set avatar_url to the data URL
      // const img = document.querySelector('#preview img') as HTMLImageElement;
      // img.src = imgDataUrl;
    } catch (error) {
      console.error('Error reading file:', error);
      // this.notImage = true;
      this.avatar = null;
      event.target.value = '';
    }
  }

  private readFileAsDataURL(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  }

  uploadImage() {
    let url = new URL(
      `${environment.baseURL}/api/hall/user_management/upload-images`
    );

    let payload = {
      image: this.avatar,
    };
    let dt = this.convertToFormData(payload);
    this.apiService
      .post(url.href, dt)
      .pipe(first())
      .subscribe((res: any) => {
        this.imageToUpload = res[0]?.url;
      });
  }
  convertToFormData(formData: any) {
    var form_data = new FormData();
    for (var key in formData) {
      form_data.append(key, formData[key]);
    }
    return form_data;
  }
}
