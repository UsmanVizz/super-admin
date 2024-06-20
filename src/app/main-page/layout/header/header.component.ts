import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { AuthServiceService } from 'src/app/services/auth-service.service';
import { environment } from '../../../../environment/environment';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
  standalone: true,
  imports: [CommonModule, RouterModule],
})
export class HeaderComponent implements OnInit {
  isLoggedIn: boolean = false;
  userData: any;
  isOpen = false;

  endUrl = environment.baseURL;

  constructor(
    private router: Router,
    private authService: AuthServiceService
  ) {}

  ngOnInit(): void {
    this.isLoggedIn = this.authService.isLoggedIn();

    if (this.isLoggedIn) {
      this.toggleDropdown();

      this.userData = this.authService.getLoggedInUserName();
      this.userData = this.userData?.data;

      const twelveHoursInMilliseconds = 12 * 60 * 60 * 1000;

      if (this.isLoggedIn) {
        setTimeout(() => {
          this.onSignOut();
        }, twelveHoursInMilliseconds);
      }

      this.getUserProfile();
    }
  }

  toggleDropdown() {
    this.isOpen = !this.isOpen;
  }

  userProfile() {
    this.router.navigateByUrl('/profile');
  }

  onSignOut() {
    // Disable the button to prevent multiple clicks
    this.isLoggedIn = false;

    // Call the logout method from AuthService
    this.authService.logout();

    // Redirect to the login page
    this.router.navigate(['/auth/login']);
    // if (this.isLoggedIn) {
    //   this.authService.logout();
    //   this.isLoggedIn = false;
    // } else {
    //   this.router.navigate(['/auth/login']);
    // }
  }

  getUserProfile() {
    let newLink = this.userData?.image.replace('images/', `${this.endUrl}/`);

    if (this.isLoggedIn) {
      this.userData.image = newLink;
    }
  }
}
