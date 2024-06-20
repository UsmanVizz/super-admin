import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { environment } from 'src/environment/environment';
import { ApiService, ApiResponse } from 'src/app/services/api-services.service';
import { Router } from '@angular/router';
import { AllUsersService } from 'src/app/services/all-users.service';
import Swal from 'sweetalert2';
import { first } from 'rxjs';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';
@Component({
  selector: 'app-user-management',
  templateUrl: './user-management.component.html',
  styleUrls: ['./user-management.component.scss'],
  standalone: true,
  imports: [CommonModule, FormsModule],
})
export class UserManagementComponent implements OnInit {
  pageSize: number = 10;
  currentPage: number = 1;
  totalPages!: number;
  searchQuery: string = '';
  pages!: number[];
  paginatedData: any[] = [];
  filteredData: any[] = [];
  tableData: any[] = [];
  filterVisible: boolean = false;
  sortOption: string = 'All';
  showDropdown: boolean = false;
  selectedBranch: string = '';
  selectedMenu: string = '';
  constructor(
    private router: Router,
    private allUsers: AllUsersService,
    private apiService: ApiService
  ) {}

  ngOnInit(): void {
    this.getUserData();
  }
  getUserData() {
    let url = new URL(
      `${environment.baseURL}/api/hall/user_management/user_management`
    );
    this.apiService.get(url.href).subscribe(
      (response) => {
        // Log the response to check its structure
        console.log('API Response:', response);

        // Assuming the correct data structure is response.data.data which is an array of objects
        if (Array.isArray(response.data?.data)) {
          this.tableData = response.data.data; // Assign directly to tableData
        } else {
          this.tableData = []; // Initialize as empty array if not an array
        }

        this.filteredData = [...this.tableData]; // Initialize filteredData with tableData

        this.calculatePages();
        this.paginate();
      },
      (error) => {
        console.log(error);
      }
    );
  }

  //delete
  deleteUsers(cardId: string) {
    const url = `https://dev-backend.hamaravenue.com/api/hall/user_management/user_management/${cardId}`;

    Swal.fire({
      title: 'Are you sure?',
      text: 'You want to delete it?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: 'grey',
      confirmButtonText: 'Yes',
    }).then((result) => {
      if (result.isConfirmed) {
        // User confirmed, proceed with deletion
        this.apiService
          .delete(url)
          .pipe(first())
          .subscribe(
            () => {
              // Delete successful, display success message
              Swal.fire({
                title: 'Deleted!',
                text: 'User has been deleted.',
                icon: 'success',
              });

              // Update your data after successful deletion
              this.filteredData = this.filteredData.filter(
                (user) => user._id !== cardId
              );

              this.getUserData();

              console.log('deal deleted successfully');
            },
            (error) => {
              // Error occurred during deletion, display error message
              Swal.fire({
                title: 'Error!',
                text: 'An error occurred while deleting the deal.',
                icon: 'error',
              });

              console.error('Error deleting branch:', error);
            }
          );
      }
    });
  }
  // Calculate total number of pages and set paginated data
  calculatePages(): void {
    this.totalPages = Math.ceil(this.filteredData.length / this.pageSize);
    this.pages = Array(this.totalPages)
      .fill(0)
      .map((x, i) => i + 1);
  }

  // Paginate data based on current page
  paginate(): void {
    const startIndex = (this.currentPage - 1) * this.pageSize;
    const endIndex = startIndex + this.pageSize;
    this.paginatedData = this.filteredData.slice(startIndex, endIndex);
    console.log('this.paginatedData', this.paginatedData);
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

  // filterData(): void {
  //   this.filteredData = this.tableData.filter((item: any) => {
  //     return (
  //       item.name?.toLowerCase()?.includes(this.searchQuery.toLowerCase()) ||
  //       item.email?.toLowerCase()?.includes(this.searchQuery.toLowerCase()) ||
  //       false
  //     );
  //   });
  //   this.currentPage = 1; // Reset to the first page when filtering
  //   this.calculatePages(); // Recalculate pagination after filtering
  //   this.paginate(); // Apply pagination to filtered data
  // }

  addEmployee() {
    this.router.navigate(['/user-management/add-employee']);
  }

  editEmployee(user: any) {
    this.router.navigate(['/user-management/edit-employee']);
    this.allUsers.setUserDetail(user);
  }

  viewDetails(user: any) {
    this.router.navigate(['/user-management/view-user-management']);
    this.allUsers.setUserDetail(user);
  }

  selectedButton: string = 'all';

  selectButton(button: string) {
    this.selectedButton = button;
  }

  //buttons

  toggleFilter() {
    this.filterVisible = !this.filterVisible;
  }

  closeFilters(event: Event): void {
    event.stopPropagation();
    this.filterVisible = false;
    this.selectedBranch = '';
    this.getUserData();
  }

  stopPropagation(event: Event): void {
    event.stopPropagation();
  }
  sortBy(option: string) {
    if (option === 'ascending') {
      this.filteredData.sort((a, b) =>
        a.full_name && b.full_name ? a.full_name.localeCompare(b.full_name) : 0
      );
      this.sortOption = 'Ascending';
    } else if (option === 'descending') {
      this.filteredData.sort((a, b) =>
        a.full_name && b.full_name ? b.full_name.localeCompare(a.full_name) : 0
      );
      this.sortOption = 'Descending';
    } else if (option === 'all') {
      // Display the "All" option when sorting by both ascending and descending
      this.filteredData.sort((a, b) =>
        a.full_name && b.full_name ? a.full_name.localeCompare(b.full_name) : 0
      );
      this.sortOption = 'All';
    }

    this.paginate(); // Assuming this function is used for pagination
    this.showDropdown = false;
  }

  toggleSorting() {
    this.showDropdown = !this.showDropdown;
    console.log('sorting');
  }
  // //search

  onSearchChange() {
    if (!this.searchQuery) {
      this.filteredData = [...this.tableData];
      this.paginate();
      return;
    }
    this.filteredData = this.tableData.filter((category) =>
      category.full_name.toLowerCase().includes(this.searchQuery.toLowerCase())
    );
    this.paginate();
  }

  filterByAlphabet(alphabet: string) {
    if (alphabet === 'all') {
      this.filteredData = [...this.tableData];
    } else {
      this.filteredData = this.tableData.filter((category) =>
        category.full_name.toLowerCase().startsWith(alphabet.toLowerCase())
      );
    }
    this.searchQuery = '';
    this.showDropdown = false;
    this.paginate();
  }

  filterByRole(): void {
    if (this.selectedMenu) {
      this.filteredData = this.tableData.filter(
        (card: any) => card._id === this.selectedMenu
      );
      console.log(' this.filteredData', this.filteredData);
    } else {
      this.filteredData = this.tableData;
    }
  }
}
