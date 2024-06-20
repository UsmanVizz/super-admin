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
  selector: 'app-manage-branch',
  templateUrl: './manage-branch.component.html',
  styleUrls: ['./manage-branch.component.scss'],
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule, LazyLoadImageModule],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class ManageBranchComponent implements OnInit, AfterViewInit {
  @ViewChildren('carouselElement') carouselElements: QueryList<any> =
    new QueryList();
  currentPage: number = 1;
  itemsPerPage: number = 4;
  showDropdown: boolean = false;
  searchQuery: string = '';
  branchId: string | null = null;
  newData: any = null;
  branches: any[] = [];
  images: any;
  selectedBranch: any;
  selectedPriceRange: string = '';
  filterVisible: boolean = false;
  menuCategories: any[] = [];
  sortOption: string = 'All';
  filteredCategories: any[] = [];
  defaultImage = '../../../assets/halls/image.webp';
  isDropdownOpen: boolean = false;
  activeIndex: number = 0;
  activeDropdownIndex: number | null = null;
  onSearchChange() {
    if (!this.searchQuery) {
      this.filteredCategories = [...this.menuCategories];
      this.getBranchData(); // Call getBranchData function when search query is null
      return;
    }
    this.filteredCategories = this.menuCategories.filter((category) =>
      category.branch_name
        .toLowerCase()
        .includes(this.searchQuery.toLowerCase())
    );
  }

  filterByAlphabet(alphabet: string) {
    if (alphabet === 'all') {
      this.filteredCategories = [...this.menuCategories]; // Reset to all categories
    } else {
      // Filter categories that start with the selected alphabet
      this.filteredCategories = this.menuCategories.filter((category) =>
        category.branch_name.toLowerCase().startsWith(alphabet.toLowerCase())
      );
    }
    this.searchQuery = '';
    this.showDropdown = false;
    this.getBranchData();
  }
  constructor(
    private router: Router,
    private apiService: ApiService,
    private manageBranchService: ManageBranchService
  ) {}

  ngOnInit(): void {
    this.getBranchData();
    this.getAllBranches();
  }
  getBranchData() {
    let url = new URL(`${environment.baseURL}/api/hall/branch/branches`);
    this.apiService
      .get(url.href)
      .pipe(first())
      .subscribe(
        (response) => {
          // this.menuCategories = response?.branches;
          this.menuCategories = response.branches.map((branch: any) => ({
            ...branch,
            truncatedAddress: this.getTruncatedAddress(
              branch.address[0].street_adress
            ),
          }));
          this.filteredCategories = [...this.menuCategories];
          this.paginateData();
        },
        (error) => {
          console.log(error);
        }
      );
  }
  getTruncatedAddress(address: string): string {
    if (!address) return '';
    const words = address.split(' ');
    if (words.length <= 3) return address;
    return words.slice(0, 3).join(' ') + '...';
  }
  deleteBranch(branchId: string, index: number) {
    const url = `https://dev-backend.hamaravenue.com/api/hall/branch/branch/${branchId}`;

    Swal.fire({
      title: 'Are you sure you want to delete it?',

      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: 'grey',
      confirmButtonText: 'Yes',
    }).then((result) => {
      if (result.isConfirmed) {
        this.apiService
          .delete(url)
          .pipe(first())
          .subscribe(
            () => {
              Swal.fire({
                title: 'Deleted!',
                text: 'Branch has been deleted.',
                icon: 'success',
              });
              this.filteredCategories = this.filteredCategories.filter(
                (branch) => branch._id !== branchId
              );
              if (this.activeDropdownIndex === index) {
                this.activeDropdownIndex = null; // Close the dropdown
              }
              this.getBranchData();
              this.getAllBranches();
              this.paginateData();
            },
            (error) => {
              // Error occurred during deletion, display error message
              Swal.fire({
                title: 'Error!',
                text: 'An error occurred while deleting the branch.',
                icon: 'error',
              });

              console.error('Error deleting branch:', error);
            }
          );
      }
    });
  }

  // toggleDropdown(index: number) {
  //   this.activeDropdownIndex =
  //     this.activeDropdownIndex === index ? null : index;
  // }
  toggleDropdown(index: number) {
    if (this.activeDropdownIndex === index) {
      this.activeDropdownIndex = null; // Close the dropdown
    } else {
      this.activeDropdownIndex = index; // Open the dropdown
    }
  }

  navigateToAddBranch() {
    this.router.navigate(['/branch-manage/add-branch']);
  }

  setActiveIndex(index: number) {
    this.activeIndex = index;
  }

  getCardDetails(id: string) {
    this.apiService
      .get(`https://dev-backend.hamaravenue.com/api/hall/branch/branches/${id}`)
      .subscribe(
        (response: any) => {
          console.log('Card Details:', response);
        },
        (error: any) => {
          console.error('Error fetching card details:', error);
        }
      );
  }

  editBranch(branchId: string) {
    console.log('branch-id', branchId);
    this.router.navigate(['/branch-manage/edit-branch', branchId]);
  }
  viewBranch(branchId: string) {
    this.router.navigate(['/branch-manage/branch-detail', branchId]);
  }
  paginateData(): void {
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    const endIndex = startIndex + this.itemsPerPage;
    this.filteredCategories = this.menuCategories.slice(startIndex, endIndex);

    // If the current page has no items due to deletion, adjust the current page
    if (this.filteredCategories.length === 0 && this.currentPage > 1) {
      this.currentPage--; // Move to the previous page
      this.paginateData(); // Recalculate pagination with the adjusted page
    }
  }

  get totalPages(): number {
    return Math.ceil(this.menuCategories.length / this.itemsPerPage);
  }

  get pages(): number[] {
    const pageCount = Math.min(5, this.totalPages);
    const startPage = Math.max(1, this.currentPage - Math.floor(pageCount / 2));
    const endPage = Math.min(this.totalPages, startPage + pageCount - 1);
    return Array.from(
      { length: endPage - startPage + 1 },
      (_, i) => startPage + i
    );
  }

  setCurrentPage(page: number): void {
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage = page;
      this.paginateData();
    }
  }

  nextPage(): void {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
      window.scrollTo({
        top: 0,
        behavior: 'smooth',
      });
      this.paginateData();
    }
  }

  prevPage(): void {
    if (this.currentPage > 1) {
      this.currentPage--;
      this.paginateData();
    }
  }

  ngAfterViewInit(): void {
    this.carouselElements.changes.subscribe(() => {
      this.carouselElements.forEach((carousel) => {
        $(carousel.nativeElement).carousel();
      });
    });
  }
  //filter code

  toggleFilter() {
    this.filterVisible = !this.filterVisible;
  }

  closeFilters() {
    this.filterVisible = false;
    this.selectedBranch = '';
    this.getBranchData();
  }
  sortBy(option: string) {
    if (option === 'ascending') {
      this.menuCategories.sort((a, b) =>
        a.branch_name && b.branch_name
          ? a.branch_name.localeCompare(b.branch_name)
          : 0
      );
      this.sortOption = 'Ascending';
    } else if (option === 'descending') {
      this.menuCategories.sort((a, b) =>
        a.branch_name && b.branch_name
          ? b.branch_name.localeCompare(a.branch_name)
          : 0
      );
      this.sortOption = 'Descending';
    } else if (option === 'all') {
      // Display the "All" option when sorting by both ascending and descending
      this.menuCategories.sort((a, b) =>
        a.branch_name && b.branch_name
          ? a.branch_name.localeCompare(b.branch_name)
          : 0
      );
      this.sortOption = 'All';
    }

    this.showDropdown = false;
    this.paginateData();
  }

  toggleSorting() {
    this.showDropdown = !this.showDropdown;
    console.log('sorting');
  }
  //filter branches

  getAllBranches() {
    let url = `${environment.baseURL}/api/hall/branch/branches/select`;

    this.apiService
      .get(url)
      .pipe(first())
      .subscribe(
        (response: any) => {
          this.branches = response.branches.map((branch: any) => ({
            _id: branch._id,
            branch_name: branch.branch_name,
          }));
          console.log('branch', this.branches);
        },
        (error) => {
          console.log(error);
        }
      );
  }

  filterByBranch() {
    if (this.selectedBranch) {
      this.filteredCategories = this.menuCategories.filter(
        (card) => card._id === this.selectedBranch
      );
    } else {
      this.filteredCategories = this.menuCategories;
    }
  }
}
