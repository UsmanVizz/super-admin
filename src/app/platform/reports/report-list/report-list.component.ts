import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { OrderServiceService } from 'src/app/services/order-service.service';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-report-list',
  templateUrl: './report-list.component.html',
  styleUrls: ['./report-list.component.scss'],
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule, ReactiveFormsModule],
})
export class ReportListComponent implements OnInit {
  searchQuery: string = '';
  filteredData: any[] = [];
  selectedButton: string = 'all';

  selectButton(button: string) {
    this.selectedButton = button;
  }
  data: any = [
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

  constructor(
    private router: Router,
    private orderService: OrderServiceService
  ) {}

  ngOnInit(): void {
    this.calculatePages();
    this.filterData();
  }

  // Calculate total number of pages and set paginated data
  calculatePages(): void {
    this.totalPages = Math.ceil(this.data.length / this.pageSize);
    this.paginate();
  }

  // Paginate data based on current page
  paginate(): void {
    const startIndex = (this.currentPage - 1) * this.pageSize;
    const endIndex = startIndex + this.pageSize;
    this.paginatedData = this.data.slice(startIndex, endIndex);
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

  viewDetails() {
    this.router.navigate(['/generate-report']);
  }

  deleteRows(index: any) {
    this.data.splice(index, 1);
    this.calculatePages();
    this.filterData();
  }

  showSidebar: boolean = false;
}
