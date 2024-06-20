import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import * as $ from 'jquery';
import { Router } from '@angular/router';

@Component({
  selector: 'app-total-expense',
  templateUrl: './total-expense.component.html',
  styleUrls: ['./total-expense.component.scss'],
  standalone: true,
  imports: [CommonModule],
})
export class TotalExpenseComponent implements OnInit {
  @ViewChild('exampleModal') modalElement!: ElementRef;
  pageSize: number = 5;
  currentPage: number = 1;
  totalPages!: number;
  searchQuery: string = '';
  pages!: number[];
  paginatedData!: any[];
  filteredData: any[] = [];
  selectedOption: string = 'All';
  selectSmallButton(option: string): void {
    this.selectedOption = option;
  }

  financeManagement() {
    this.router.navigate(['/expense-manage']);
  }
  constructor(private router: Router) {}
  tableData = [
    {
      id: '01',
      imageUrl: 'assets/images/customer.png',
      order_id: '#12367237',
      vander_service: '02',
      event_date: '2 feb 2023-1 to 5',
      payment_type: '200,000',
      expense: '200,000',
      expense_type: 'Food',
    },
    {
      id: '02',
      order_id: '#12367237',
      vander_service: '02',
      event_date: '2 feb 2023-1 to 5',
      payment_type: '200,000',
      expense: '200,000',
      expense_type: 'Food',
    },
    {
      id: '03',

      order_id: '#12367237',
      vander_service: '02',
      event_date: '2 feb 2023-1 to 5',
      payment_type: '200,000',
      expense: '200,000',
      expense_type: 'Food',
    },
    {
      id: '04',

      order_id: '#12367237',
      vander_service: '02',
      event_date: '2 feb 2023-1 to 5',
      payment_type: '200,000',
      expense: '200,000',
      expense_type: 'Food',
    },
    {
      id: '05',

      order_id: '#12367237',
      vander_service: '02',
      event_date: '2 feb 2023-1 to 5',
      payment_type: '200,000',
      expense: '200,000',
      expense_type: 'Food',
    },
    {
      id: '06',

      order_id: '#12367237',
      vander_service: '02',
      event_date: '2 feb 2023-1 to 5',
      payment_type: '200,000',
      expense: '200,000',
      expense_type: 'Food',
    },
    {
      id: '07',

      order_id: '#12367237',
      vander_service: '02',
      event_date: '2 feb 2023-1 to 5',
      payment_type: '200,000',
      expense: '200,000',
      expense_type: 'Food',
    },
    {
      id: '08',

      order_id: '#12367237',
      vander_service: '02',
      event_date: '2 feb 2023-1 to 5',
      payment_type: '200,000',
      expense: '200,000',
      expense_type: 'Food',
    },
    {
      id: '09',
      imageUrl: 'assets/images/customer.png',
      order_id: '#12367237',
      vander_service: '02',
      event_date: '2 feb 2023-1 to 5',
      payment_type: '200,000',
      expense: '200,000',
      expense_type: 'Food',
    },
    {
      id: 10,

      order_id: '#12367237',
      vander_service: '02',
      event_date: '2 feb 2023-1 to 5',
      payment_type: '200,000',
      expense: '200,000',
      expense_type: 'Food',
    },
  ];
  ngOnInit(): void {
    this.calculatePages();
    this.filterData();
  }
  selectedButton: string = 'all';

  selectButton(button: string) {
    this.selectedButton = button;
  }
  openNewComponent() {
    this.router.navigate(['add-employee']);
  }
  addBooking() {
    this.router.navigate(['expense-manage/add-booking']);
  }
  isOpen: boolean = false;

  openModal() {
    this.isOpen = true;
    console.log('hii');
  }

  closeModal() {
    this.isOpen = false;
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
