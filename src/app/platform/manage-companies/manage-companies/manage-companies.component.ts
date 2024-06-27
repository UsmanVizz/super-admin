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
  styleUrls: ['./manage-companies.component.scss']
})
export class ManageCompaniesComponent implements OnInit {
  pageSize: number = 10;
  currentPage: number = 1;
  totalPages!: number;
  searchQuery: string = '';
  pages!: number[];
  paginatedData!: any[];
  filteredData: any[] = [];
  constructor(private router: Router) { }
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
  tableData = [
    {
      id: 1,
      order_id: 'Mark',
      customer_name: 'ahmad',
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

  openNewComponent() {
    this.router.navigate(['view-manage-customer']);
    console.log('call function');
  }
  ngOnInit(): void {
    this.calculatePages();
    this.filterData();
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



  addCompanies(){
    
  }
}
