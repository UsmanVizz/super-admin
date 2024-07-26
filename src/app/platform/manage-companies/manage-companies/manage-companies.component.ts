import { CommonModule } from '@angular/common';
import {
  ApiResponse,
  ApiService,
} from '../../../services/api-services.service';
import Swal from 'sweetalert2';

import {
  Component,
  CUSTOM_ELEMENTS_SCHEMA,
  OnInit,
  ViewChildren,
  QueryList,
  AfterViewInit,
} from '@angular/core';
import { TruncateWordsPipe } from '../../../truncate-words.pipe';

import { Router, RouterModule } from '@angular/router';
import { ManageBranchService } from 'src/app/services/manage-branch.service';
import { LazyLoadImageModule } from 'ng-lazyload-image';
import { environment } from '../../../../environment/environment';
import { first } from 'rxjs';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
// declare interface JQuery<TElement extends HTMLElement> {
//   carousel(): JQuery<TElement>;
// }

declare let $: any;

@Component({
  selector: 'app-manage-companies',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule, LazyLoadImageModule],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  templateUrl: './manage-companies.component.html',
  styleUrls: ['./manage-companies.component.scss'],
})
export class ManageCompaniesComponent implements OnInit {
  pageSize: number = 10;
  currentPage: number = 1;
  totalPages!: number;
  searchQuery: string = '';
  pages!: number[];
  tableData: any[] = [];
  paginatedData!: any[];
  filteredData: any[] = [];
  constructor(private router: Router, private apiService: ApiService) {}
  ngOnInit(): void {
    this.calculatePages();
    this.getAllCategories();
    this.filterData();
  }
  sortProductsDesc(): void {
    this.tableData = this.tableData.sort((a, b) =>
      b.customer_name.localeCompare(a.customer_name)
    );
  }

  // Example event handler for a button click
  onSortButtonClick(): void {
    this.sortProductsDesc();
    console.log(1255);
  }
  getAllCategories(page: number = 1): void {
    const url = new URL(`${environment.baseURL}/api/admin/company/company`);

    this.apiService
      .get(url.href)
      .pipe(first())
      .subscribe(
        (response: any) => {
          if (response.data && response.data.length) {
            this.tableData = response.data.map((item: any, index: number) => {
              return {
                ...item,
                index: index,
              };
            });
            console.log('tableData', this.tableData);
          } else {
            this.tableData = [];
          }
        },
        (error) => {
          console.error('Error fetching categories:', error);
          this.tableData = [];
        }
      );
  }

  openNewComponent() {
    this.router.navigate(['view-manage-customer']);
    console.log('call function');
  }

  selectedButton: string = 'all';

  selectButton(button: string) {
    this.selectedButton = button;
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

  addCompanies() {
    this.router.navigate(['/companies-management/add-company']);
  }
}
