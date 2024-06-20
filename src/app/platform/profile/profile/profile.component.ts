import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { Router } from '@angular/router';
import { environment } from 'src/environment/environment';
import { ApiService } from 'src/app/services/api-services.service';
import { first } from 'rxjs';
import { ActivatedRoute } from '@angular/router';
@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss'],
  standalone: true,
  imports: [CommonModule, RouterModule],
})
export class ProfileComponent implements OnInit {
  profileData: any;
  defaultImage: string = '../../../../../assets/dashboard/profile-default.png'; // Path to your default image

  setDefaultImage(event: any) {
    event.target.src = this.defaultImage;
  }
  constructor(
    private apiService: ApiService,
    private router: Router,
    private routes: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.routes.params.subscribe((params) => {
      const id = params['id'];
      console.log('Branch ID:', id);
      this.getProfileData();
    });
  }
  editProfile() {
    this.router.navigate(['/profile/edit-profile']);
  }
  changePassword() {
    this.router.navigate(['/profile/change-password']);
  }
  personalInfo() {
    this.router.navigate(['profile']);
  }
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
        },
        (error) => {
          console.error('Error fetching branch data:', error);
        }
      );
  }
}
