import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';
import { ViewChild, ElementRef } from '@angular/core';
interface Link {
  routerLink: string;
  icon: string;
  label: string;
  whiteImgPath: string;
  grayImgPath: string;
  imgPath: string;
  submenus?: { label: string; routerLink: string }[];
  isOpen?: boolean;
}

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss'],
  standalone: true,
  imports: [CommonModule, RouterModule],
})
export class SidebarComponent implements OnInit {
  constructor(private router: Router) { }
  @ViewChild('itemEl') itemEl: ElementRef | undefined;
  toggleDropdown(link: Link): void {
    link.isOpen = !link.isOpen;
  }

  // showSubmenu(itemEl: HTMLElement) {
  //   itemEl.classList.toggle('showMenu');
  // }
  isLinkActive(link: any): boolean {
    return this.router.isActive(link.routerLink, true);
  }
  links: Link[] = [
    {
      routerLink: '/dashboard',
      icon: 'grid_view',
      label: 'Dashboard',
      whiteImgPath:
        '../../../../assets/images/sidebar-icons/dashboard-white.png',
      grayImgPath: '../../../../assets/images/sidebar-icons/dashboard-gray.png',
      imgPath: '',
      submenus: [],
    },
    {
      routerLink: '/branch-manage',
      icon: 'home_work',
      label: 'Manage companies',
      whiteImgPath:
        '../../../../assets/images/sidebar-icons/branch-icon-white.png',
      grayImgPath:
        '../../../../assets/images/sidebar-icons/branch-icon-grey.png',
      imgPath: '',
      submenus: [],
    },
    {
      routerLink: '/manage-customer',
      icon: 'person_pin',
      label: 'Manage Customer',
      whiteImgPath:
        '../../../../assets/images/sidebar-icons/customer-white.png',
      grayImgPath: '../../../../assets/images/sidebar-icons/customer-gray.png',
      imgPath: '',
      submenus: [],
    },
    {
      routerLink: '/vandors',
      icon: 'clinical_notes',
      label: 'Vendors Management',
      whiteImgPath:
        '../../../../assets/images/sidebar-icons/service-management-white.png',
      grayImgPath:
        '../../../../assets/images/sidebar-icons/service-management-gray.png',
      imgPath: '',
      submenus: [],
    },
    {
      routerLink: '/order-management',
      icon: 'contract',
      label: 'Orders Management',
      whiteImgPath:
        '../../../../assets/images/sidebar-icons/order-management-white.png',
      grayImgPath:
        '../../../../assets/images/sidebar-icons/order-management-gray.png',
      imgPath: '',
      submenus: [],
    },
    {
      routerLink: '/hall-manage',
      icon: 'domain',
      label: 'Manage Amenities',
      whiteImgPath:
        '../../../../assets/images/sidebar-icons/hall-icon-white.png',
      grayImgPath: '../../../../assets/images/sidebar-icons/hall-icon-grey.png',
      imgPath: '',
      submenus: [],
    },
    {
      routerLink: '/user-management',
      icon: 'perm_contact_calendar',
      label: 'User Management',
      whiteImgPath:
        '../../../../assets/images/sidebar-icons/user-management-white.png',
      grayImgPath:
        '../../../../assets/images/sidebar-icons/user-management-gray.png',
      imgPath: '',
      submenus: [],
    },
    {
      routerLink: '/reports',
      icon: 'universal_currency',
      label: 'Reports',
      whiteImgPath: '../../../../assets/images/sidebar-icons/reports-white.png',
      grayImgPath: '../../../../assets/images/sidebar-icons/reports-gray.png',
      imgPath: '',
      submenus: [],
    },
    {
      routerLink: '/manage-menu/catagories',
      // routerLink: '/catagories',
      icon: 'food',
      label: 'Settings',
      whiteImgPath: '../../../../assets/images/sidebar-icons/menu-white.png',
      grayImgPath: '../../../../assets/images/sidebar-icons/menu-grey.png',
      imgPath: '',
    },
    {
      routerLink: '/expense-manage',
      icon: 'assured_workload',
      label: 'System Logs',
      whiteImgPath:
        '../../../../assets/images/sidebar-icons/finance-management-white.png',
      grayImgPath:
        '../../../../assets/images/sidebar-icons/finance-management-gray.png',
      imgPath: '',
      submenus: [],
    },
    {
      routerLink: '/expense-manage',
      icon: 'assured_workload',
      label: 'CMS',
      whiteImgPath:
        '../../../../assets/images/sidebar-icons/finance-management-white.png',
      grayImgPath:
        '../../../../assets/images/sidebar-icons/finance-management-gray.png',
      imgPath: '',
      submenus: [],
    },
    {
      routerLink: '/expense-manage',
      icon: 'assured_workload',
      label: 'Manage Leads',
      whiteImgPath:
        '../../../../assets/images/sidebar-icons/finance-management-white.png',
      grayImgPath:
        '../../../../assets/images/sidebar-icons/finance-management-gray.png',
      imgPath: '',
      submenus: [],
    },


  ];

  ngOnInit(): void {
    this.router.events
      .pipe(filter((event) => event instanceof NavigationEnd))
      .subscribe(() => {
        this.setImgPaths();
      });
    this.setImgPaths();
  }

  setImgPaths(): void {
    const currentRoute = this.router.url.split('?')[0];
    this.links.forEach((link) => {
      link.imgPath =
        currentRoute === link.routerLink ? link.whiteImgPath : link.grayImgPath;
    });
  }

  getImgPath(link: Link): string {
    return link.imgPath;
  }
}
