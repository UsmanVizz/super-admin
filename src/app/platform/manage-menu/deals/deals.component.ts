import { CommonModule } from '@angular/common';
// import { InputSwitchModule } from 'primeng/inputswitch';
import {
  Component,
  CUSTOM_ELEMENTS_SCHEMA,
  OnInit,
  AfterViewInit,
  ViewChild,
  ElementRef,
} from '@angular/core';
import Swal from 'sweetalert2';
import { Router } from '@angular/router';
import { environment } from 'src/environment/environment';
import { ApiService, ApiResponse } from 'src/app/services/api-services.service';
import { first } from 'rxjs';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
// import { FormsModule } from '@angular/forms';
@Component({
  selector: 'app-deals',
  templateUrl: './deals.component.html',
  styleUrls: ['./deals.component.scss'],
  standalone: true,
  imports: [CommonModule, FormsModule],
})
export class DealsComponent implements OnInit {
  @ViewChild('filterButton', { static: false }) filterButton!: ElementRef;
  @ViewChild('filterContainer', { static: false }) filterContainer!: ElementRef;

  checked: boolean = false;
  activeIndex: number = 0;
  selectedButton: string = 'deals';
  cards: any[] = [];
  filterVisible: boolean = false;
  sortOption: string = 'All';
  searchQuery: string = '';
  showDropdown: boolean = false;
  selectedBranch: string = '';
  filteredCards: any[] = [];
  currentPage: number = 1;
  itemsPerPage: number = 2;
  totalItems: number = 0;
  selectedMenu: string = '';
  selectButton(button: string) {
    this.selectedButton = button;
    if (button === 'category') {
      this.router.navigate(['/manage-menu/catagories']);
    }
    if (button === 'menu') {
      this.router.navigate(['/manage-menu/menu']);
    }
    if (button === 'deals') {
      this.router.navigate(['/manage-menu/deals']);
    }
  }
  constructor(private router: Router, private apiService: ApiService) {}

  ngOnInit(): void {
    this.getDealsData();
  }

  getDealsData() {
    let url = new URL(`${environment.baseURL}/api/hall/menu_deal/menu_deal`);
    this.apiService.get(url.href).subscribe(
      (response) => {
        // Assuming response.data is an array of objects
        this.cards = response.data || []; // Initialize to empty array if data is null or undefined
        this.filteredCards = [...this.cards]; // Spread the array only if it's initialized properly
        this.paginateData();
      },
      (error) => {
        console.log(error);
      }
    );
  }

  manageMenu() {
    this.router.navigate(['/manage-menu/catagories']);
  }
  navigateToAddDeal() {
    this.router.navigate(['add-deal']);
    // this.router.navigate(['create-menu']);
  }

  setActiveIndex(index: number) {
    this.activeIndex = index;
  }

  deleteDeals(cardId: string) {
    const url = `https://dev-backend.hamaravenue.com/api/hall/menu_deal/menu_deal/${cardId}`;

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
                text: 'Deal has been deleted.',
                icon: 'success',
              });

              // Update your data after successful deletion
              this.filteredCards = this.filteredCards.filter(
                (deal) => deal._id !== cardId
              );
              const startIndex = (this.currentPage - 1) * this.itemsPerPage;
              if (
                startIndex >= this.filteredCards?.length &&
                this.currentPage > 1
              ) {
                // If the last item on the current page was deleted and it was not the first page,
                // move to the previous page
                this.currentPage--;
              }
              this.getDealsData();
              this.paginateData();
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
  editDeals(hallId: string) {
    this.router.navigate(['/manage-menu/deals-edit/edit-deals/', hallId]);
    window.scrollTo({
      top: 0,
      behavior: 'smooth', // Smooth scrolling animation
    });
  }
  viewDeals(hallId: string) {
    this.router.navigate(['/manage-menu/deals-edit/view-deals/', hallId]);
    window.scrollTo({
      top: 0,
      behavior: 'smooth', // Smooth scrolling animation
    });
  }

  //buttons

  toggleFilter() {
    this.filterVisible = !this.filterVisible;
  }

  closeFilters(event: Event): void {
    event.stopPropagation();
    this.filterVisible = false;
    this.selectedMenu = '';
    this.getDealsData();
  }

  stopPropagation(event: Event): void {
    event.stopPropagation();
  }
  sortBy(option: string) {
    if (option === 'ascending') {
      this.cards.sort((a, b) =>
        a.deal_name && b.deal_name ? a.deal_name.localeCompare(b.deal_name) : 0
      );
      this.sortOption = 'Ascending';
    } else if (option === 'descending') {
      this.cards.sort((a, b) =>
        a.deal_name && b.deal_name ? b.deal_name.localeCompare(a.deal_name) : 0
      );
      this.sortOption = 'Descending';
    } else if (option === 'all') {
      // Display the "All" option when sorting by both ascending and descending
      this.cards.sort((a, b) =>
        a.deal_name && b.deal_name ? a.deal_name.localeCompare(b.deal_name) : 0
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
  //search
  onSearchChange() {
    if (!this.searchQuery) {
      this.filteredCards = [...this.cards];
      this.getDealsData();
      return;
    }
    this.filteredCards = this.cards.filter((category) =>
      category.deal_name.toLowerCase().includes(this.searchQuery.toLowerCase())
    );
  }

  filterByAlphabet(alphabet: string) {
    if (alphabet === 'all') {
      this.filteredCards = [...this.cards]; // Reset to all categories
    } else {
      // Filter categories that start with the selected alphabet
      this.filteredCards = this.cards.filter((category) =>
        category.deal_name.toLowerCase().startsWith(alphabet.toLowerCase())
      );
    }
    this.searchQuery = '';
    this.showDropdown = false;
    this.getDealsData();
  }
  //pagination
  paginateData() {
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    const endIndex = startIndex + this.itemsPerPage;
    this.filteredCards = this.cards.slice(startIndex, endIndex);
  }
  get totalPages(): number {
    return Math.ceil(this.cards?.length / this.itemsPerPage);
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
  //filter
  positionFilterContainer() {
    const buttonRect = this.filterButton.nativeElement.getBoundingClientRect();
    const filterContainer = this.filterContainer.nativeElement;

    filterContainer.style.top = `${buttonRect.bottom}px`;
    filterContainer.style.left = `${buttonRect.left}px`;
  }
  getFilterMenu(branchId: string) {
    const url = `${environment.baseURL}/api/hall/menu_deal/menu_deal/?branch_id=${branchId}`;

    this.apiService
      .get(url)
      .pipe(first())
      .subscribe(
        (response: any) => {
          this.cards = response.data.map((menu: any) => ({
            _id: menu._id,
            deal_name: menu.deal_name,
          }));
        },
        (error) => {
          console.log(error);
          // Handle error appropriately, e.g., show a message
        }
      );
  }

  filterByMenu(): void {
    if (this.selectedMenu) {
      this.filteredCards = this.cards.filter(
        (card: any) => card._id === this.selectedMenu
      );
    } else {
      this.filteredCards = this.cards;
    }
  }
}
