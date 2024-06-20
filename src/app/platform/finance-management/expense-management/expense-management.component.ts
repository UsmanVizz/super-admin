import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CustomerChartComponent } from '../../finance-management/expense-management/charts/customer-chart/customer-chart.component';
import { RevenuChartComponent } from '../../finance-management/expense-management/charts/revenu-chart/revenu-chart.component';
import { Router } from '@angular/router';
import { FinanceListComponent } from '../expense-management/finance-list/finance-list.component';
@Component({
  selector: 'app-expense-management',
  templateUrl: './expense-management.component.html',
  styleUrls: ['./expense-management.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    CustomerChartComponent,
    RevenuChartComponent,
    FinanceListComponent,
  ],
})
export class ExpenseManagementComponent implements OnInit {
  pageSize: number = 5;
  currentPage: number = 1;
  totalPages!: number;
  searchQuery: string = '';
  pages!: number[];
  paginatedData!: any[];
  filteredData: any[] = [];
  totalExpense() {
    this.router.navigate(['/expense-manage/total-expense']);
  }
  totalExpanses() {
    this.router.navigate(['/total-expanses-list']);
  }

  totalRevenue() {
    this.router.navigate(['/total-revenue-list']);
  }

  bookingRevenue() {
    this.router.navigate(['/booking-revenue-list']);
  }

  totalIncome() {
    this.router.navigate(['/total-income-list']);
  }

  vendorRevenue() {
    this.router.navigate(['/vendor-revenue-list']);
  }
  constructor(private router: Router) {}
  tableData = [
    {
      id: '01',
      order_id: 'Mark',
      customer_name: 'Otto',
      date_time: '@mdo',
      booking_date: '2 feb 2023',
      hall_name: 'A1+A2+A3',
      order_amount: '200,000',
      advance: '0000-0000000-0',
    },
    {
      id: '02',
      order_id: 'Mark',
      customer_name: 'Otto',
      date_time: '@mdo',
      booking_date: '2 feb 2023',
      hall_name: 'A1+A2+A3',
      order_amount: '200,000',
      advance: '0000-0000000-0',
    },
    {
      id: '03',
      order_id: 'Mark',
      customer_name: 'Otto',
      date_time: '@mdo',
      booking_date: '2 feb 2023',
      hall_name: 'A1+A2+A3',
      order_amount: '200,000',
      advance: '0000-0000000-0',
    },
    {
      id: '04',
      order_id: 'Mark',
      customer_name: 'Otto',
      date_time: '@mdo',
      booking_date: '2 feb 2023',
      hall_name: 'A1+A2+A3',
      order_amount: '200,000',
      advance: '0000-0000000-0',
    },
    {
      id: '05',
      order_id: 'Mark',
      customer_name: 'Otto',
      date_time: '@mdo',
      booking_date: '2 feb 2023',
      hall_name: 'A1+A2+A3',
      order_amount: '200,000',
      advance: '0000-0000000-0',
    },
    {
      id: '06',
      order_id: 'Mark',
      customer_name: 'Otto',
      date_time: '@mdo',
      booking_date: '2 feb 2023',
      hall_name: 'A1+A2+A3',
      order_amount: '200,000',
      advance: '0000-0000000-0',
    },
    {
      id: '07',
      order_id: 'Mark',
      customer_name: 'Otto',
      date_time: '@mdo',
      booking_date: '2 feb 2023',
      hall_name: 'A1+A2+A3',
      order_amount: '200,000',
      advance: '0000-0000000-0',
    },
    {
      id: '08',
      order_id: 'Mark',
      customer_name: 'Otto',
      date_time: '@mdo',
      booking_date: '2 feb 2023',
      hall_name: 'A1+A2+A3',
      order_amount: '200,000',
      advance: '0000-0000000-0',
    },
    {
      id: '09',
      order_id: 'Mark',
      customer_name: 'Otto',
      date_time: '@mdo',
      booking_date: '2 feb 2023',
      hall_name: 'A1+A2+A3',
      order_amount: '200,000',
      advance: '0000-0000000-0',
    },
    {
      id: '10',
      order_id: 'Mark',
      customer_name: 'Otto',
      date_time: '@mdo',
      booking_date: '2 feb 2023',
      hall_name: 'A1+A2+A3',
      order_amount: '200,000',
      advance: '0000-0000000-0',
    },
  ];
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
}
