import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-bookings',
  templateUrl: './bookings.component.html',
  styleUrls: ['./bookings.component.scss'],
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule, ReactiveFormsModule],
})
export class BookingsComponent implements OnInit {
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
  tableData = [
    {
      id: 1,
      order_id: 'Mark',
      customer_name: 'Otto',
      date_time: '@mdo',
      booking_date: '2 feb 2023',
      hall_name: 'A1+A2+A3',
      order_amount: '200,000',
      advance: '20,000',
    },
    {
      id: 2,
      order_id: 'Mark',
      customer_name: 'Otto',
      date_time: '@mdo',
      booking_date: '2 feb 2023',
      hall_name: 'A1+A2+A3',
      order_amount: '200,000',
      advance: '20,000',
    },
    {
      id: 3,
      order_id: 'Mark',
      customer_name: 'Otto',
      date_time: '@mdo',
      booking_date: '2 feb 2023',
      hall_name: 'A1+A2+A3',
      order_amount: '200,000',
      advance: '20,000',
    },
    {
      id: 4,
      order_id: 'Mark',
      customer_name: 'Otto',
      date_time: '@mdo',
      booking_date: '2 feb 2023',
      hall_name: 'A1+A2+A3',
      order_amount: '200,000',
      advance: '20,000',
    },
    {
      id: 5,
      order_id: 'Mark',
      customer_name: 'Otto',
      date_time: '@mdo',
      booking_date: '2 feb 2023',
      hall_name: 'A1+A2+A3',
      order_amount: '200,000',
      advance: '20,000',
    },
    {
      id: 6,
      order_id: 'Mark',
      customer_name: 'Otto',
      date_time: '@mdo',
      booking_date: '2 feb 2023',
      hall_name: 'A1+A2+A3',
      order_amount: '200,000',
      advance: '20,000',
    },
    {
      id: 7,
      order_id: 'Mark',
      customer_name: 'Otto',
      date_time: '@mdo',
      booking_date: '2 feb 2023',
      hall_name: 'A1+A2+A3',
      order_amount: '200,000',
      advance: '20,000',
    },
    {
      id: 8,
      order_id: 'Mark',
      customer_name: 'Otto',
      date_time: '@mdo',
      booking_date: '2 feb 2023',
      hall_name: 'A1+A2+A3',
      order_amount: '200,000',
      advance: '20,000',
    },
    {
      id: 9,
      order_id: 'Mark',
      customer_name: 'Otto',
      date_time: '@mdo',
      booking_date: '2 feb 2023',
      hall_name: 'A1+A2+A3',
      order_amount: '200,000',
      advance: '20,000',
    },
    {
      id: 10,
      order_id: 'Mark',
      customer_name: 'Otto',
      date_time: '@mdo',
      booking_date: '2 feb 2023',
      hall_name: 'A1+A2+A3',
      order_amount: '200,000',
      advance: '20,000',
    },
    {
      id: 11,
      order_id: 'Mark',
      customer_name: 'Otto',
      date_time: '@mdo',
      booking_date: '2 feb 2023',
      hall_name: 'A1+A2+A3',
      order_amount: '200,000',
      advance: '20,000',
    },
    {
      id: 12,
      order_id: 'Mark',
      customer_name: 'Otto',
      date_time: '@mdo',
      booking_date: '2 feb 2023',
      hall_name: 'A1+A2+A3',
      order_amount: '200,000',
      advance: '20,000',
    },
    {
      id: 13,
      order_id: 'Mark',
      customer_name: 'Otto',
      date_time: '@mdo',
      booking_date: '2 feb 2023',
      hall_name: 'A1+A2+A3',
      order_amount: '200,000',
      advance: '20,000',
    },
    {
      id: 14,
      order_id: 'Mark',
      customer_name: 'Otto',
      date_time: '@mdo',
      booking_date: '2 feb 2023',
      hall_name: 'A1+A2+A3',
      order_amount: '200,000',
      advance: '20,000',
    },
    {
      id: 15,
      order_id: 'Mark',
      customer_name: 'Otto',
      date_time: '@mdo',
      booking_date: '2 feb 2023',
      hall_name: 'A1+A2+A3',
      order_amount: '200,000',
      advance: '20,000',
    },
    {
      id: 16,
      order_id: 'Mark',
      customer_name: 'Otto',
      date_time: '@mdo',
      booking_date: '2 feb 2023',
      hall_name: 'A1+A2+A3',
      order_amount: '200,000',
      advance: '20,000',
    },
  ];

  pageSize: number = 10;
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
    this.totalPages = Math.ceil(this.tableData.length / this.pageSize);
    this.paginate();
  }

  // Paginate data based on current page
  paginate(): void {
    const startIndex = (this.currentPage - 1) * this.pageSize;
    const endIndex = startIndex + this.pageSize;
    this.paginatedData = this.tableData.slice(startIndex, endIndex);
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
    this.filteredData = this.tableData.filter((item: any) => {
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

  manageOrder() {
    this.router.navigate(['/order-management']);
  }

  viewDetails(imageUrl: string) {
    this.router.navigate(['//order-details'], {
      queryParams: { data: imageUrl },
    });
  }
  bookingDetails() {
    this.router.navigate(['//add-bookings']);
  }
  deleteRows(index: any) {
    this.tableData.splice(index, 1);
    this.calculatePages();
    this.filterData();
    this.toastr.success('Deleted Successfully');
  }
}
