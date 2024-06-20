import {
  Component,
  OnInit,
  Renderer2,
  ElementRef,
  HostListener,
} from '@angular/core';
import { Router } from '@angular/router';

declare const $: any;
declare interface RouteInfo {
  path: string;
  title: string;
  icon: string;
  class: string;
}
export const ROUTES: RouteInfo[] = [
  { path: 'dashboard', title: 'Dashboard', icon: 'dashboard', class: '' },
  { path: 'branch-manage', title: 'Manage Branch', icon: 'person', class: '' },
  {
    path: 'hall-manage',
    title: 'hall Manage',
    icon: 'content_paste',
    class: '',
  },
];

@Component({
  selector: 'app-side-bar',
  templateUrl: './side-bar.component.html',
  styleUrls: ['./side-bar.component.scss'],
})
export class SideBarComponent implements OnInit {
  showSubmenu(itemEl: HTMLElement) {
    itemEl.classList.toggle('showMenu');
  }
  menuItems = [
    {
      title: 'Dashboard',
      routerLink: 'dashboard',
      iconClass: 'grid_view ',
      subItems: [],
    },

    {
      title: 'Manage Branches',
      routerLink: 'branch-manage',
      iconClass: 'home_work',
      subItems: [],
    },
    {
      title: 'Manage Hall',
      routerLink: 'hall-manage',
      iconClass: 'domain',
      subItems: [],
    },
    {
      title: 'Orders Management',
      routerLink: 'order-management',
      iconClass: 'contract',
      subItems: [],
    },
    {
      title: 'Manage Menu',
      iconClass: 'monetization_on',
      routerLink: null,
      subItems: [
        { title: 'Categories ', routerLink: 'catagories' },
        { title: 'Menu listing', routerLink: 'menu' },
        { title: 'Deals', routerLink: 'deals' },
      ],
      showDropdown: false,
    },
    {
      title: 'Manage Customer',
      routerLink: 'manage-customer',
      iconClass: 'person_pin',
      subItems: [],
    },
    {
      title: 'Vendors Management',
      routerLink: 'vandors',
      iconClass: 'clinical_notes',
      subItems: [],
    },
    {
      title: 'Finance Management',
      routerLink: 'expense-manage',
      iconClass: 'assured_workload',
      subItems: [],
    },
    {
      title: 'User Management',
      routerLink: 'user-management',
      iconClass: 'perm_contact_calendar',
      subItems: [],
    },
    {
      title: 'Reports',
      routerLink: 'reports',
      iconClass: 'universal_currency',
      subItems: [],
    },
    {
      title: 'Profile',
      routerLink: 'profile',
      iconClass: 'person',
      subItems: [],
    },
  ];

  darkMode = false;
  sidebar: any;
  home: any;
  body: any;
  sidebar_state: boolean = false;

  constructor(private router: Router) {}

  @HostListener('window:resize', ['$event'])
  onResize(event: Event): void {
    this.ngOnInit();
  }
  ngOnInit() {
    this.sidebar = document.querySelector('.sidebar');
    this.home = document.querySelector('.home');
    this.body = document.querySelector('body');

    this.darkMode = localStorage.getItem('dark_mode') == 'true' ? true : false;

    if (this.darkMode) {
      this.body?.classList.add('dark');
      localStorage.setItem('dark_mode', 'true');
      this.darkMode = true;
    }

    let windowWidth = window.innerWidth;
    if (windowWidth <= 768) {
      this.sidebar?.classList.add('close');
      this.home?.classList.add('close');
    } else {
      let sidebar_state = localStorage.getItem('sidebar_state');
      if (sidebar_state == 'close') {
        this.sidebar?.classList.add('close');
        this.home?.classList.add('close');
        localStorage.setItem('sidebar_state', 'close');
      } else {
        this.sidebar.classList.remove('close');
        this.home?.classList.remove('close');
        localStorage.setItem('sidebar_state', 'open');
        this.sidebar_state = true;
      }
    }
  }

  toggleDarkMode() {
    if (this.body?.classList.contains('dark')) {
      this.body.classList.remove('dark');
      localStorage.setItem('dark_mode', 'false');
      this.darkMode = false;
    } else {
      this.body?.classList.add('dark');
      localStorage.setItem('dark_mode', 'true');
      this.darkMode = true;
    }
  }

  toggleSidebar() {
    if (this.sidebar?.classList.contains('close')) {
      this.sidebar.classList.remove('close');
      this.sidebar_state = true;
      this.home?.classList.remove('close');
      localStorage.setItem('sidebar_state', 'open');
    } else {
      this.sidebar?.classList.add('close');
      this.home?.classList.add('close');
      this.sidebar_state = false;
      localStorage.setItem('sidebar_state', 'close');
    }
  }
  isMobile: boolean = false;
  checkIfMobile() {
    // Implement your logic to determine if it's mobile here
    // For example, you can use window.innerWidth
    this.isMobile = window.innerWidth <= 768; // Assuming 768px is your mobile breakpoint
  }
  isMobileMenu() {
    if ($(window).width() > 768) {
      return false;
    }
    return true;
  }
}
