import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-order-management',
  templateUrl: './order-management.component.html',
  styleUrls: ['./order-management.component.scss'],
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule, ReactiveFormsModule],
})
export class OrderManagementComponent {
  searchQuery: string = '';
  filteredData: any[] = [];
  selectedButton: string = 'all';

  selectedOption: string = 'All';
  selectSmallButton(option: string): void {
    this.selectedOption = option;
  }
  selectButton(button: string) {
    this.selectedButton = button;
  }
  manageBooking() {
    this.router.navigate(['/bookings']);
    console.log('booking');
  }
  manageReservation() {
    this.router.navigate(['/reservation']);
  }
  manageProgress() {
    this.router.navigate(['/hall-inprogress']);
  }
  manageCancel() {
    this.router.navigate(['/hall-cancelled']);
  }
  data: any = [
    {
      name: 'shop name',
      dateTime: '27 March 2021, at 12:30 PM',
      price: '+Rs.2500',
    },
    {
      name: 'shop name',
      dateTime: '27 March 2021, at 12:30 PM',
      price: '+Rs.2500',
    },
    {
      name: 'shop name',
      dateTime: '27 March 2021, at 12:30 PM',
      price: '+Rs.2500',
    },
    {
      name: 'shop name',
      dateTime: '27 March 2021, at 12:30 PM',
      price: '+Rs.2500',
    },
    {
      name: 'shop name',
      dateTime: '27 March 2021, at 12:30 PM',
      price: '+Rs.2500',
    },
  ];

  dataImage: any = [
    {
      imageUrl: '../../../../assets/images/profiles/profile-1.png',
    },
    {
      imageUrl: '../../../../assets/images/profiles/profile-2.png',
    },
    {
      imageUrl: '../../../../assets/images/profiles/profile-3.png',
    },
    {
      imageUrl: '../../../../assets/images/profiles/profile-4.png',
    },
    {
      imageUrl: '../../../../assets/images/profiles/profile-5.png',
    },
    {
      imageUrl: '../../../../assets/images/profiles/profile-6.png',
    },
    {
      imageUrl: '../../../../assets/images/profiles/profile-7.png',
    },
    {
      imageUrl: '../../../../assets/images/profiles/profile-8.png',
    },
  ];

  pageSize: number = 5;
  currentPage: number = 1;
  totalPages!: number;
  paginatedData!: any[];
  pages!: number[];

  constructor(private router: Router, private toastr: ToastrService) {}

  ngOnInit(): void {
    this.calculatePages();
    this.filterData();
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
    this.filteredData = this.data.filter((item: any) => {
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
    this.router.navigate(['//order-management']);
  }

  viewDetails(imageUrl: string) {
    this.router.navigate(['//order-details'], {
      queryParams: { data: imageUrl },
    });
  }

  deleteRows(index: any) {
    this.dataImage.splice(index, 1);
    this.calculatePages();
    this.filterData();
    this.toastr.success('Deleted Successfully');
  }
}
