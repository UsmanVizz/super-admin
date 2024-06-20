import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
  FormControl,
} from '@angular/forms';
import { first } from 'rxjs/operators';
import { ApiService } from 'src/app/services/api-services.service';
import { UserManagmentService } from 'src/app/services/user-managment.service';
import { environment } from '../../../../environment/environment';
import { ToastrService } from 'ngx-toastr';
import { SwalService } from 'src/app/services/swal.service';
import { ChangeDetectorRef } from '@angular/core';
@Component({
  selector: 'app-add-employee',
  templateUrl: './add-employee.component.html',
  styleUrls: ['./add-employee.component.scss'],
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule, ReactiveFormsModule],
})
export class AddEmployeeComponent implements OnInit {
  uploadedthumbnail: any[] = [];
  avatar: any;
  avatar_url: any;
  imageToUpload: any;
  addEmployeeForm: FormGroup;
  selectedDate: any;
  branches: any[] = [];
  updated_profile: boolean = false;
  setThumbnail: string = '';

  flatpickrOptions: any = {
    altInput: true,
    altFormat: 'F j, Y',
    dateFormat: 'Y-m-d',
    // Other options can be added here as needed.
  };

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
    private fb: FormBuilder,
    private userManageService: UserManagmentService,
    private toastr: ToastrService,
    private swalService: SwalService,
    private apiService: ApiService,
    private changeDetectorRef: ChangeDetectorRef
  ) {
    this.addEmployeeForm = this.fb.group({
      full_name: new FormControl('', [Validators.required]),
      email: new FormControl('', [Validators.required, Validators.email]),
      address: this.fb.group({
        street_address: new FormControl('', Validators.required),
      }),
      cnic: new FormControl(''),
      phone_no: new FormControl(''),
      salary: new FormControl(''),
      joining_date: new FormControl('', [Validators.required]),
      role: new FormControl(''),
      branch_id: new FormControl(''),
      password: new FormControl(''),
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
    this.getAllBranches();
  }

  navigateToUser() {
    this.router.navigate(['/user-management']);
  }

  emailCorrection() {
    const emailControl: any = this.addEmployeeForm.get('email');
    if (emailControl?.value) {
      const domain = emailControl.value.substring(
        emailControl?.value.lastIndexOf('@') + 1
      );
      if (domain !== 'gmail.com' && domain !== 'yopmail.com') {
        emailControl.setErrors({ invalidDomain: true });
      } else {
        emailControl.setErrors(null);
      }
    }
  }

  getEmailErrorMessage() {
    if (this.addEmployeeForm.get('email')?.hasError('required')) {
      return 'Email address is required.';
    }
    if (this.addEmployeeForm.get('email')?.hasError('invalidDomain')) {
      return 'Email address should be from yopmail.com or gmail.com.';
    }
    return 'Please enter a valid email address.';
  }

  addressValidator() {
    return Validators.pattern(
      /^[^!@#$%^&*()\[\]{}'`~]+(,[^!@#$%^&*()\[\]{}'`~]+)*(\/[^!@#$%^&*()\[\]{}'`~]+)*$/
    );
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

      this.userManageService.getUsersImg(formData).subscribe(
        (res: any) => {
          this.uploadedthumbnail.push(res);
          console.log('Upload successful Thumbnail', res);
          this.setThumbnail = res?.[0]?.url; // Adjust according to the actual response structure
          console.log('Upload Thumbnail URL ', this.setThumbnail);
          // this.cdr.detectChanges(); // Trigger change detection
        },
        (err) => {
          console.error('Error uploading image:', err);
        }
      );
    }
  }

  saveChanges() {
    if (this.addEmployeeForm.valid) {
      this.employeeRegistered();
    } else {
      console.log('Form is invalid. Please fill in all required fields.');
      this.toastr.error('Form is invalid. Please fill in all required fields.');

      // Log specific errors for each form control
      this.logFormErrors();
    }
  }

  logFormErrors() {
    Object.keys(this.addEmployeeForm.controls).forEach((key) => {
      const controlErrors = this.addEmployeeForm.get(key)?.errors;
      if (controlErrors != null) {
        Object.keys(controlErrors).forEach((keyError) => {
          console.log(
            `Key control: ${key}, keyError: ${keyError}, errorValue: `,
            controlErrors[keyError]
          );
          this.toastr.error(`Error in ${key}: ${keyError}`);
        });
      }
    });
  }

  employeeRegistered() {
    const formData: any = {
      full_name: this.addEmployeeForm.value.full_name,
      email: this.addEmployeeForm.value.email,
      street_address: this.addEmployeeForm.value.address?.street_address,
      cnic: this.addEmployeeForm.value.cnic,
      phone_no: this.addEmployeeForm.value.phone_no,
      salary: this.addEmployeeForm.value.salary,
      joining_date: this.addEmployeeForm.value.joining_date,
      branch_id: this.addEmployeeForm.value.branch_id,
      role: this.addEmployeeForm.value.role,
      user_name: this.addEmployeeForm.value.user_name,
      password: this.addEmployeeForm.value.password,
      confirm_password: this.addEmployeeForm.value.confirm_password,
      // profile_image: this.setThumbnail,
    };

    if (this.avatar === null) {
      formData.profile_image = '';
    } else {
      formData.profile_image = this.imageToUpload;
    }

    console.log('Form Data to be sent', formData);

    this.userManageService.addNewUsers(formData).subscribe(
      (res) => {
        console.log('User Added', res);
        this.swalService.showSuccess('Employee Added Successfully');
        this.router.navigate(['user-management']);
      },
      (error) => {
        console.error('Error adding user', error);

        if (error.status === 400 && error.error.message === 'Duplicate email') {
          // Assuming 409 Conflict status code and specific error message for duplicate email
          this.swalService.showError(
            'Duplicate email address. Please use a different email.'
          );
        } else {
          this.swalService.showError(error.message);
        }
      }
    );
  }
  //*********************************** */
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
