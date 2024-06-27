import { CommonModule } from '@angular/common';
import { Component, OnInit, ViewChild } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CustomerChartComponent } from './charts/customer-chart/customer-chart.component';
import { LocationChartComponent } from './charts/location-chart/location-chart.component';
import { RevenueChartComponent } from './charts/revenue-chart/revenue-chart.component';
import { GoogleMapsComponent } from 'src/app/shared/google-maps/google-maps.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

declare var google: any;
declare var $: any;
@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    FormsModule,
    ReactiveFormsModule,
    [
      RevenueChartComponent,
      CustomerChartComponent,
      LocationChartComponent,
      GoogleMapsComponent,
    ],
  ],
})
export class DashboardComponent implements OnInit {
  @ViewChild('binMap') binMap: GoogleMapsComponent | any;

  // animatedValues: { [key: string]: number } = {
  //   totalCustomers: 0,
  //   totalVenders: 0,
  //   totalRevenue: 0,
  //   totalCompanies: 0,
   
  // };
  // values: { [key: string]: number } = {
  //   totalCustomers: 5,
  //   totalVenders: 5,
  //   totalRevenue: 20,
  //   totalCompanies: 18,

  // };
  // duration: number = 2000;

  animatedValues: { [key: string]: number } = {
    totalCustomers: 0,
    totalVendors: 0,
    totalRevenue: 0,
    totalCompanies: 0,
  };

  data = [
    {
      title: 'Total Companies',
      img: 'assets/dashboard/company-Icon.svg',
      key: 'totalCompanies',
      trend: 8.5,
      icon: 'trending_up',
      color: '#00b69b'
    },
    {
      title: 'Total Customers',
      img: 'assets/dashboard/customer-Icon.svg',
      key: 'totalCustomers',
      trend: 4.3,
      icon: 'trending_up',
      color: '#00b69b'
    },
    {
      title: 'Total Vendors',
      img: 'assets/dashboard/vendor-Icon.svg',
      key: 'totalVendors',
      trend: -1.3,
      icon: 'trending_down',
      color: '#f93c65'
    },
    {
      title: 'Total Revenue',
      img: 'assets/dashboard/revnue-Icon.svg',
      key: 'totalRevenue',
      trend: 1.8,
      icon: 'trending_up',
      color: '#00b69b'
    }
  ];

  dataArray: any = [
    {
      name: "shop name",
      dateTime: "27 March 2021, at 12:30 PM",
      price: "+Rs.2500",
    },
    {
      name: "shop name",
      dateTime: "27 March 2021, at 12:30 PM",
      price: "+Rs.2500",
    },
    {
      name: "shop name",
      dateTime: "27 March 2021, at 12:30 PM",
      price: "+Rs.2500",
    },
    {
      name: "shop name",
      dateTime: "27 March 2021, at 12:30 PM",
      price: "+Rs.2500",
    },
    {
      name: "shop name",
      dateTime: "27 March 2021, at 12:30 PM",
      price: "+Rs.2500",
    },
  ];

  dataImage: any = [
    {
      imageUrl: "../../../../assets/images/profiles/profile-1.png",
    },
    {
      imageUrl: "../../../../assets/images/profiles/profile-2.png",
    },
    {
      imageUrl: "../../../../assets/images/profiles/profile-3.png",
    },
    {
      imageUrl: "../../../../assets/images/profiles/profile-4.png",
    },
    {
      imageUrl: "../../../../assets/images/profiles/profile-5.png",
    },
    {
      imageUrl: "../../../../assets/images/profiles/profile-6.png",
    },
    {
      imageUrl: "../../../../assets/images/profiles/profile-7.png",
    },
    {
      imageUrl: "../../../../assets/images/profiles/profile-8.png",
    },
  ];

  pageSize: number = 5;
  currentPage: number = 1;
  totalPages!: number;
  paginatedData!: any[];
  pages!: number[];
  searchQuery: string = "";
  filteredData: any[] = [];

  values: { [key: string]: number } = {
    totalCustomers: 5,
    totalVendors: 5,
    totalRevenue: 20,
    totalCompanies: 18,
  };
  duration: number = 2000;



  animationInterval: any;

  constructor() {}

  ngOnInit(): void {
    // for (const key in this.animatedValues) {
    //   if (this.animatedValues.hasOwnProperty(key)) {
    //     this.animateValue(key);
    //   }
    // }
    for (const key in this.animatedValues) {
      if (this.animatedValues.hasOwnProperty(key)) {
        this.animateValue(key);
      }
    }
    setTimeout(() => {
      this.binMap.setupLocations();
    }, 2000);
  }

  // animateValue(key: string) {
  //   let start = 0;
  //   const increment = ((this.values[key] - start) / this.duration) * 10;
  //   const animate = () => {
  //     start += increment;
  //     this.animatedValues[key] = Math.min(start, this.values[key]);
  //     if (start < this.values[key]) {
  //       requestAnimationFrame(animate);
  //     }
  //   };
  //   requestAnimationFrame(animate);
  // }

  animateValue(key: string) {
    let start = 0;
    const increment = ((this.values[key] - start) / this.duration) * 10;
    const animate = () => {
      start += increment;
      this.animatedValues[key] = Math.min(start, this.values[key]);
      if (start < this.values[key]) {
        requestAnimationFrame(animate);
      }
    };
    requestAnimationFrame(animate);
  }


  // Calculate total number of pages and set paginated data
  calculatePages(): void {
    this.totalPages = Math.ceil(this.dataImage.length / this.pageSize);
    this.paginate();
  }

  // Paginate data based on current page
  paginate(): void {
    const startIndex = (this.currentPage - 1) * this.pageSize;
    const endIndex = startIndex + this.pageSize;
    this.paginatedData = this.dataImage.slice(startIndex, endIndex);
    this.pages = Array(this.totalPages)
      .fill(0)
      .map((x, i) => i + 1);
  }

  // Set current page
  setCurrentPage(page: number): void {
    this.currentPage = page;
    this.paginate();
  }

  // Go to previous page
  prevPage(): void {
    if (this.currentPage > 1) {
      this.currentPage--;
      this.paginate();
    }
  }

  // Go to next page
  nextPage(): void {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
      this.paginate();
    }
  }

  filterData(): void {
    this.filteredData = this.dataArray.filter((item: any) => {
      // Use optional chaining to safely access name and email properties
      return (
        item.name?.toLowerCase()?.includes(this.searchQuery.toLowerCase()) ||
        false ||
        item.email?.toLowerCase()?.includes(this.searchQuery.toLowerCase()) ||
        false
      );
    });
    this.calculatePages(); // Recalculate pagination after filtering
  }

  onSearchChange(): void {
    this.filterData();
  }

  addOrder() {
    // this.router.navigate(["/order-management"]);
  }

  viewDetails(imageUrl: string) {
    // this.router.navigate(["/order-details"], {
    //   queryParams: { data: imageUrl },
    // });
  }

  deleteRows(index: any) {
    // this.dataImage.splice(index, 1);
    // this.calculatePages();
    // this.filterData();
    // this.toastr.success("Deleted Successfully");
  }
}
