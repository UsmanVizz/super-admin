import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MainPageComponent } from './main-page/main-page.component';

const routes: Routes = [
  {
    path: '',
    component: MainPageComponent,
    children: [
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
      {
        path: 'dashboard',
        loadComponent: () =>
          import('./../platform/dashboard/dashboard/dashboard.component').then(
            (m) => m.DashboardComponent
          ),
      },
      {
        path: 'expense-manage',
        loadComponent: () =>
          import(
            './../platform/finance-management/expense-management/expense-management.component'
          ).then((m) => m.ExpenseManagementComponent),
      },

      {
        path: 'manage-customer',
        loadComponent: () =>
          import(
            '../platform/manage-customer/manage-customers/manage-customers.component'
          ).then((m) => m.ManageCustomersComponent),
      },
      {
        path: 'hall-manage',
        loadComponent: () =>
          import(
            './../platform/manage-hall/manage-hall/manage-hall.component'
          ).then((m) => m.ManageHallComponent),
      },
      {
        path: 'manage-menu/catagories',
        loadComponent: () =>
          import(
            '../platform/manage-menu/catagories/catagories.component'
          ).then((m) => m.CatagoriesComponent),
      },
      {
        path: 'hall-manage/add-hall',
        loadComponent: () =>
          import('./../platform/manage-hall/add-hall/add-hall.component').then(
            (m) => m.AddHallComponent
          ),
      },
      {
        path: 'hall-manage/edit-hall/:id',
        loadComponent: () =>
          import(
            './../platform/manage-hall/edit-halls/edit-halls.component'
          ).then((m) => m.EditHallsComponent),
      },

      {
        path: 'manage-menu/catagories/add-category',
        loadComponent: () =>
          import(
            './../platform/manage-menu/add-category/add-category.component'
          ).then((m) => m.AddCategoryComponent),
      },
      {
        path: 'manage-menu/catagories/edit-category/:id',
        loadComponent: () =>
          import(
            './../platform/manage-menu/edit-category/edit-category.component'
          ).then((m) => m.EditCategoryComponent),
      },
      {
        path: 'manage-menu/catagories/view-category/:id',
        loadComponent: () =>
          import(
            './../platform/manage-menu/view-category/view-category.component'
          ).then((m) => m.ViewCategoryComponent),
      },
      {
        path: 'add-deal',
        loadComponent: () =>
          import('./../platform/manage-menu/add-deal/add-deal.component').then(
            (m) => m.AddDealComponent
          ),
      },
      {
        path: 'add-menu',
        loadComponent: () =>
          import('./../platform/manage-menu/add-menu/add-menu.component').then(
            (m) => m.AddMenuComponent
          ),
      },
      {
        path: 'manage-menu/menus/view-menu/:id',
        loadComponent: () =>
          import(
            './../platform/manage-menu/menus/view-menu/view-menu.component'
          ).then((m) => m.ViewMenuComponent),
      },
      {
        path: 'manage-menu/menus/edit-menu/:id',
        loadComponent: () =>
          import(
            './../platform/manage-menu/menus/edit-menu/edit-menu.component'
          ).then((m) => m.EditMenuComponent),
      },
      {
        path: 'hall-manage/hall-detail/:id',
        loadComponent: () =>
          import(
            './../platform/manage-hall/hall-detail/hall-detail.component'
          ).then((m) => m.HallDetailComponent),
      },
      {
        path: 'manage-menu/deals',
        loadComponent: () =>
          import('./../platform/manage-menu/deals/deals.component').then(
            (m) => m.DealsComponent
          ),
      },
      {
        path: 'manage-menu/deals-edit/edit-deals/:id',
        loadComponent: () =>
          import(
            './../platform/manage-menu/deals-edit/edit-deals/edit-deals.component'
          ).then((m) => m.EditDealsComponent),
      },
      {
        path: 'manage-menu/deals-edit/view-deals/:id',
        loadComponent: () =>
          import(
            './../platform/manage-menu/deals-edit/view-deals/view-deals.component'
          ).then((m) => m.ViewDealsComponent),
      },
      {
        path: 'manage-menu/menu',
        loadComponent: () =>
          import('./../platform/manage-menu/menu/menu.component').then(
            (m) => m.MenuComponent
          ),
      },
      {
        path: 'bookings',
        loadComponent: () =>
          import(
            './../platform/order-managment/bookings/bookings.component'
          ).then((m) => m.BookingsComponent),
      },
      {
        path: 'edit-booking',
        loadComponent: () =>
          import(
            './../platform/order-managment/edit-booking/edit-booking.component'
          ).then((m) => m.EditBookingComponent),
      },
      {
        path: 'add-vendor-booking',
        loadComponent: () =>
          import(
            './../platform/order-managment/add-vendor-booking/add-vendor-booking.component'
          ).then((m) => m.AddVendorBookingComponent),
      },
      {
        path: 'add-booking-team',
        loadComponent: () =>
          import(
            './../platform/order-managment/add-booking-team/add-booking-team.component'
          ).then((m) => m.AddBookingTeamComponent),
      },
      {
        path: 'add-booking-menu',
        loadComponent: () =>
          import(
            './../platform/order-managment/add-booking-menu/add-booking-menu.component'
          ).then((m) => m.AddBookingMenuComponent),
      },
      {
        path: 'hall-cancelled',
        loadComponent: () =>
          import(
            './../platform/order-managment/cancelled/cancelled.component'
          ).then((m) => m.CancelledComponent),
      },
      {
        path: 'hall-inprogress',
        loadComponent: () =>
          import(
            './../platform/order-managment/in-progress/in-progress.component'
          ).then((m) => m.InProgressComponent),
      },
      {
        path: 'add-bookings',
        loadComponent: () =>
          import(
            './../platform/order-managment/add-bookings/add-bookings.component'
          ).then((m) => m.AddBookingsComponent),
      },
      {
        path: 'reservation',
        loadComponent: () =>
          import(
            './../platform/order-managment/reservation/reservation.component'
          ).then((m) => m.ReservationComponent),
      },
      {
        path: 'profile',
        loadComponent: () =>
          import('./../platform/profile/profile/profile.component').then(
            (m) => m.ProfileComponent
          ),
      },
      {
        path: 'reports',
        loadComponent: () =>
          import('./../platform/reports/reports/reports.component').then(
            (m) => m.ReportsComponent
          ),
      },
      {
        path: 'report-list',
        loadComponent: () =>
          import(
            './../platform/reports/report-list/report-list.component'
          ).then((m) => m.ReportListComponent),
      },
      {
        path: 'report-chart',
        loadComponent: () =>
          import(
            './../platform/reports/report-chart/report-chart.component'
          ).then((m) => m.ReportChartComponent),
      },

      {
        path: 'vandors',
        loadComponent: () =>
          import(
            './../platform/vandors-management/vandors-management/vandors-management.component'
          ).then((m) => m.VandorsManagementComponent),
      },
      //Manage Companies
      {
        path: 'companies-management',
        loadComponent: () =>
          import(
            './../platform/manage-companies/manage-companies/manage-companies.component'
          ).then((m) => m.ManageCompaniesComponent),
      },
      {
        path: 'companies-management/company-detail/:id',
        loadComponent: () =>
          import(
            './../platform/manage-companies/detail-companies/detail-companies.component'
          ).then((m) => m.DetailCompaniesComponent),
      },
      {
        path: 'companies-management/add-company',
        loadComponent: () =>
          import(
            '../platform/manage-companies/add-companies/add-companies.component'
          ).then((m) => m.AddCompaniesComponent),
      },
      {
        path: 'companies-management/edit-company/:id',
        loadComponent: () =>
          import(
            '../platform/manage-companies/edit-companies/edit-companies.component'
          ).then((m) => m.EditCompaniesComponent),
      },

      //End Manage Companies

      {
        path: 'view-manage-customer',
        loadComponent: () =>
          import(
            '../platform/manage-customer/view-manage-customer/view-manage-customer.component'
          ).then((m) => m.ViewManageCustomerComponent),
      },

//User Management
      {
        path: 'user-management',
        loadComponent: () =>
          import(
            './../platform/user-management/user-management/user-management.component'
          ).then((m) => m.UserManagementComponent),
      },
      {
        path: 'user-management/add-employee',
        loadComponent: () =>
          import(
            './../platform/user-management/add-employee/add-employee.component'
          ).then((m) => m.AddEmployeeComponent),
      },
      {
        path: 'user-management/edit-employee',
        loadComponent: () =>
          import(
            './../platform/user-management/edit-employee/edit-employee.component'
          ).then((m) => m.EditEmployeeComponent),
      },
      {
        path: 'user-management/view-user-management',
        loadComponent: () =>
          import(
            './../platform/user-management/view-user-management/view-user-management.component'
          ).then((m) => m.ViewUserManagementComponent),
      },
// End User Management



      {
        path: 'profile/edit-profile',
        loadComponent: () =>
          import(
            './../platform/profile/edit-profile/edit-profile.component'
          ).then((m) => m.EditProfileComponent),
      },
      {
        path: 'profile/change-password',
        loadComponent: () =>
          import(
            './../platform/profile/change-password/change-password.component'
          ).then((m) => m.ChangePasswordComponent),
      },
      {
        path: 'expense-manage/total-expense',
        loadComponent: () =>
          import(
            './../platform/finance-management/total-expense/total-expense.component'
          ).then((m) => m.TotalExpenseComponent),
      },
      {
        path: 'expense-manage/add-booking',
        loadComponent: () =>
          import(
            './../platform/finance-management/add-booking/add-booking.component'
          ).then((m) => m.AddBookingComponent),
      },
      {
        path: 'order-management',
        loadComponent: () =>
          import(
            './../platform/order-managment/order-management/order-management.component'
          ).then((m) => m.OrderManagementComponent),
      },
      {
        path: 'vandors/add-vendor',
        loadComponent: () =>
          import(
            '../platform/vandors-management/add-vendor/add-vendor.component'
          ).then((m) => m.AddVendorComponent),
      },
      {
        path: 'vandors/add-vendors-details',
        loadComponent: () =>
          import(
            '../platform/vandors-management/add-vendors-details/add-vendors-details.component'
          ).then((m) => m.AddVendorsDetailsComponent),
      },
    ],
  },
  // { path: 'addhall', loadComponent: () => import('./../platform/manage-hall/add-hall/add-hall.component').then(m => m.AddHallComponent), pathMatch: "full" },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class MainPageRoutingModule { }
