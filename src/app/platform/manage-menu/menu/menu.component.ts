import {
  Component,
  ViewChild,
  ElementRef,
  OnInit,
  AfterViewInit,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';
import { first } from 'rxjs';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ApiService, ApiResponse } from 'src/app/services/api-services.service';
import { environment } from '../../../../environment/environment';
@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.scss'],
  standalone: true,
  imports: [CommonModule, FormsModule],
})
export class MenuComponent implements OnInit {
  scrollDistance = 10;
  scrollInterval = 10;
  scrollIntervalId: any;
  totalItems: number = 0;
  currentPage: number = 1;
  filteredCategories: any[] = [];
  cards: any[] = [];
  cardsData: any[] = [];
  itemsPerPage: number = 4;
  filterVisible: boolean = false;
  sortOption: string = 'All';
  searchQuery: string = '';
  showDropdown: boolean = false;
  selectedMenu: string = '';
  branches: any[] = [];
  // activeIndex: number = 0;
  categoryId: any;
  @ViewChild('cardRow', { static: true }) cardRow!: ElementRef<HTMLDivElement>;
  @ViewChild('scrollContainer') scrollContainer: ElementRef;
  @ViewChild('carouselExampleIndicators2', { static: true })
  carouselExampleIndicators2!: ElementRef;
  @ViewChild('filterButton', { static: false }) filterButton!: ElementRef;
  @ViewChild('filterContainer', { static: false }) filterContainer!: ElementRef;

  cardWidth: number = 300;
  selectedButton: string = 'menu';
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
  manageMenu() {
    this.router.navigate(['/manage-menu/catagories']);
  }
  //category
  getAllCategories() {
    let url = new URL(
      `${environment.baseURL}/api/hall/menu_category/menu_category`
    );
    this.apiService
      .get(url.href)
      .pipe(first())
      .subscribe(
        (response: any) => {
          this.cardsData = response.data;
          console.log('this.cardsData', this.cardsData);
        },
        (error: any) => {
          console.log(error);
        }
      );
  }

  prevSlide() {
    this.scrollContainer?.nativeElement.scrollBy({
      left: -100, // Adjust scroll distance as needed
      behavior: 'smooth', // Enable smooth scrolling
    });
    console.log('prev');
  }

  // Function to scroll to the next slide
  nextSlide() {
    this.scrollContainer?.nativeElement.scrollBy({
      left: 100, // Adjust scroll distance as needed
      behavior: 'smooth', // Enable smooth scrolling
    });
  }

  constructor(private router: Router, private apiService: ApiService) {
    this.selectedCards = new Array(this.cardsData?.length).fill(false);
    this.scrollContainer = {} as ElementRef;
  }

  ngOnInit(): void {
    this.getAllMenu();
    this.getAllCategories();
  }
  getAllMenu() {
    let url = new URL(`${environment.baseURL}/api/hall/menu_item/menu_item`);
    this.apiService
      .get(url.href)
      .pipe(first())
      .subscribe(
        (response: any) => {
          console.log('API response', response);
          // Check if response.data is an array
          if (Array.isArray(response.data)) {
            this.cards = response.data;
          } else {
            console.error('Expected an array but got:', response.data);
            this.cards = []; // Default to an empty array to avoid further errors
          }
          console.log('this.cards', this.cards);
          this.filteredCategories = [...this.cards];
          this.paginateData();
        },
        (error: any) => {
          console.log(error);
        }
      );
  }

  // getAllMenu() {
  //   let url = new URL(`${environment.baseURL}/api/hall/menu_item/menu_item`);
  //   this.apiService
  //     .get(url.href)
  //     .pipe(first())
  //     .subscribe(
  //       (response: any) => {
  //         this.cards = response.data;
  //         console.log('this.cards', this.cards);
  //         this.filteredCategories = [...this.cards];
  //         this.paginateData();
  //       },
  //       (error: any) => {
  //         console.log(error);
  //       }
  //     );
  // }
  navigateToAddMenu() {
    this.router.navigate(['/add-menu']);
  }
  selectedCards: boolean[] = [];
  toggleSelection(index: number) {
    this.selectedCards[index] = !this.selectedCards[index];
    console.log('ddd');
  }
  ////delete
  deleteCategory(categoryId: string): void {
    const url = `${environment.baseURL}/api/hall/menu_item/menu_item/${categoryId}`;

    Swal.fire({
      title: 'Are you sure?',
      text: 'You want to delete it?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: 'grey',
      confirmButtonText: 'Yes!',
    }).then((result) => {
      if (result.isConfirmed) {
        this.apiService
          .delete(url)
          .pipe(first())
          .subscribe(
            (res: any) => {
              Swal.fire({
                title: 'Deleted!',
                text: res.message || 'Category has been deleted.',
                icon: 'success',
              });

              // Update the categories list after successful deletion
              this.cards = this.cards.filter(
                (category) => category._id !== categoryId
              );
              this.totalItems = this.cards?.length;

              // Adjust current page after deletion
              const startIndex = (this.currentPage - 1) * this.itemsPerPage;
              if (startIndex >= this.cards?.length && this.currentPage > 1) {
                // If the last item on the current page was deleted and it was not the first page,
                // move to the previous page
                this.currentPage--;
              }

              this.getAllMenu();
              this.paginateData();
            },
            (error) => {
              Swal.fire({
                title: 'Error!',
                text: 'An error occurred while deleting the Category.',
                icon: 'error',
              });
              console.error('Error deleting Category:', error);
            }
          );
      }
    });
  }

  //////
  isSelected(index: number): boolean {
    return this.selectedCards[index];
  }

  //pagination
  paginateData() {
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    const endIndex = startIndex + this.itemsPerPage;
    this.filteredCategories = this.cards.slice(startIndex, endIndex);
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
  //view
  viewCategory(categoryId: string) {
    this.router.navigate(['/manage-menu/menus/view-menu', categoryId]);
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  }
  ///edit
  editCategory(categoryId: string) {
    this.router.navigate(['/manage-menu/menus/edit-menu', categoryId]);

    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  }
  //buttons

  closeFilters(event: Event): void {
    event.stopPropagation();
    this.filterVisible = false;
    this.selectedMenu = '';
    this.getAllMenu();
  }

  stopPropagation(event: Event): void {
    event.stopPropagation();
  }
  sortBy(option: string) {
    if (option === 'ascending') {
      this.cards.sort((a, b) =>
        a.item_name && b.item_name ? a.item_name.localeCompare(b.item_name) : 0
      );
      this.sortOption = 'Ascending';
    } else if (option === 'descending') {
      this.cards.sort((a, b) =>
        a.item_name && b.item_name ? b.item_name.localeCompare(a.item_name) : 0
      );
      this.sortOption = 'Descending';
    } else if (option === 'all') {
      // Display the "All" option when sorting by both ascending and descending
      this.cards.sort((a, b) =>
        a.item_name && b.item_name ? a.item_name.localeCompare(b.item_name) : 0
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
      this.filteredCategories = [...this.cards];
      this.getAllCategories();
      return;
    }
    this.filteredCategories = this.cards.filter((category) =>
      category.item_name.toLowerCase().includes(this.searchQuery.toLowerCase())
    );
  }

  filterByAlphabet(alphabet: string) {
    if (alphabet === 'all') {
      this.filteredCategories = [...this.cards]; // Reset to all categories
    } else {
      // Filter categories that start with the selected alphabet
      this.filteredCategories = this.cards.filter((category) =>
        category.item_name.toLowerCase().startsWith(alphabet.toLowerCase())
      );
    }
    this.searchQuery = '';
    this.showDropdown = false;
    this.getAllCategories();
  }
  //filter branches
  toggleFilter() {
    this.filterVisible = !this.filterVisible;
    if (this.filterVisible) {
      this.positionFilterContainer();
    }
  }

  positionFilterContainer() {
    const buttonRect = this.filterButton.nativeElement.getBoundingClientRect();
    const filterContainer = this.filterContainer.nativeElement;

    filterContainer.style.top = `${buttonRect.bottom}px`;
    filterContainer.style.left = `${buttonRect.left}px`;
  }

  getFilterMenu(categoryId: string) {
    const url = `${environment.baseURL}/api/hall/menu_item/menu_item?category_id=${categoryId}`;

    this.apiService
      .get(url)
      .pipe(first())
      .subscribe(
        (response: any) => {
          this.cards = response.data.map((branch: any) => ({
            _id: branch._id,
            item_name: branch.item_name,
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
      this.filteredCategories = this.cards.filter(
        (card: any) => card._id === this.selectedMenu
      );
    } else {
      this.filteredCategories = this.cards;
    }
  }
}
