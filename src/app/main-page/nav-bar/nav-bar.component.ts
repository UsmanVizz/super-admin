import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import { ROUTES } from '../side-bar/side-bar.component';
import { Location } from '@angular/common';
import { Router } from '@angular/router';
// import { valueOrDefault } from 'chart.js/dist/helpers/helpers.core';
import { CdkMenu } from '@angular/cdk/menu';
// import { MenuItem } from 'primeng/api';
import { AuthServiceService } from '../../services/auth-service.service';

@Component({
  selector: 'app-nav-bar',
  templateUrl: './nav-bar.component.html',
  styleUrls: ['./nav-bar.component.scss'],
})
export class NavBarComponent implements OnInit {
  isLoggedIn: boolean = false;
  userData: any;
  isOpen = false;
  private listTitles: any[] = [];
  location: Location;
  mobile_menu_visible: any = 0;
  private toggleButton: any;
  private sidebarVisible: boolean;
  title: string;
  @ViewChild('menu') menu!: CdkMenu;

  constructor(
    location: Location,
    private element: ElementRef,
    private router: Router,
    private authService: AuthServiceService
  ) {
    this.location = location;
    this.sidebarVisible = false;
    this.title = this.getTitle();
  }
  toggleDropdown() {
    this.isOpen = !this.isOpen;
  }

  userProfile() {
    this.router.navigate(['profile']);
  }

  onSignOut() {
    if (this.isLoggedIn) {
      this.authService.logout();
      this.isLoggedIn = false;
    } else {
      this.router.navigate(['login']);
    }
  }
  ngOnInit() {
    this.isLoggedIn = this.authService.isLoggedIn();

    this.toggleDropdown();

    this.userData = this.authService.getLoggedInUserName();
    this.userData = this.userData.data;
    // this.listTitles = ROUTES.filter(listTitle => listTitle);
    // const navbar: HTMLElement = this.element.nativeElement;
    // this.toggleButton = navbar.getElementsByClassName('navbar-toggler')[0];

    // this.router.events.subscribe((event) => {
    //   this.title = this.getTitle();
    // });
    this.listTitles = ROUTES.filter((listTitle) => listTitle);
    const navbar: HTMLElement = this.element.nativeElement;
    this.toggleButton = navbar.getElementsByClassName('navbar-toggler')[0];
    this.getTitle();
    this.router.events.subscribe((event) => {
      this.getTitle();
    });
  }

  sidebarOpen() {
    const toggleButton = this.toggleButton;
    const body = document.getElementsByTagName('body')[0];
    setTimeout(() => {
      toggleButton.classList.add('toggled');
    }, 500);
    body.classList.add('nav-open');
    this.sidebarVisible = true;
  }

  sidebarClose() {
    const body = document.getElementsByTagName('body')[0];
    this.toggleButton.classList.remove('toggled');
    this.sidebarVisible = false;
    body.classList.remove('nav-open');
  }

  sidebarToggle() {
    var $toggle = document.getElementsByClassName('navbar-toggler')[0];
    var $layer: any;
    if (this.sidebarVisible === false) {
      this.sidebarOpen();
    } else {
      this.sidebarClose();
    }
    const body = document.getElementsByTagName('body')[0];
    if (this.mobile_menu_visible == 1) {
      body.classList.remove('nav-open');
      $layer = document.getElementsByClassName('close-layer')[0];
      if ($layer) {
        $layer.remove();
      }
      setTimeout(() => {
        $toggle.classList.remove('toggled');
      }, 400);
      this.mobile_menu_visible = 0;
    } else {
      setTimeout(() => {
        $toggle.classList.add('toggled');
      }, 430);
      $layer = document.createElement('div');
      $layer.setAttribute('class', 'close-layer');
      if (body.querySelectorAll('.main-panel')) {
        document.getElementsByClassName('main-panel')[0].appendChild($layer);
      } else if (body.classList.contains('off-canvas-sidebar')) {
        document
          .getElementsByClassName('wrapper-full-page')[0]
          .appendChild($layer);
      }
      setTimeout(() => {
        $layer.classList.add('visible');
      }, 100);
      $layer.onclick = () => {
        body.classList.remove('nav-open');
        this.mobile_menu_visible = 0;
        $layer.classList.remove('visible');
        setTimeout(() => {
          $layer.remove();
          $toggle.classList.remove('toggled');
        }, 400);
      };
      body.classList.add('nav-open');
      this.mobile_menu_visible = 1;
    }
  }
  getTitle() {
    let title = 'Dashboard';

    switch (this.router.url.replace('/', '').toLowerCase()) {
      case 'dashboard': {
        title = 'Dashboard';
        break;
      }
      case 'branch-manage': {
        title = 'Manage Branch';
        break;
      }
      case 'hall-manage': {
        title = 'hall Manage';
        break;
      }
      // Add more cases for other paths as needed
      default: {
        title = 'Dashboard';
      }
    }

    return title;
  }

  // getTitle() {
  //   var titlee = this.location.prepareExternalUrl(this.location.path());
  //   if (titlee.charAt(0) === '#') {
  //     titlee = titlee.slice(1);
  //   }
  //   for (var item = 0; item < this.listTitles.length; item++) {
  //     if (this.listTitles[item].path === titlee) {
  //       return this.listTitles[item].title;
  //     }
  //   }
  //   return 'Dashboard';
  // }
}
