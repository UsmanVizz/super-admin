import {
  Component,
  OnInit,
  HostListener,
  ViewChildren,
  QueryList,
  AfterViewInit,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { LazyLoadImageModule } from 'ng-lazyload-image';
import { environment } from 'src/environment/environment';
import { ApiService, ApiResponse } from 'src/app/services/api-services.service';
import { first } from 'rxjs';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import Swal from 'sweetalert2';
interface PageEvent {
  first: number;
  rows: number;
  page: number;
  pageCount: number;
}
interface newUser {
  id: number;
  image: string[];
  currentIndex: number; // Add currentIndex property for each user
}
declare let $: any;
@Component({
  selector: 'app-manage-hall',
  templateUrl: './manage-hall.component.html',
  styleUrls: ['./manage-hall.component.scss'],
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule, LazyLoadImageModule],
})
export class ManageHallComponent implements OnInit, AfterViewInit {
  @ViewChildren('carouselElement') carouselElements: QueryList<any> =
    new QueryList();
  first: number = 0;
  currentIndex = 0;
  rows: number = 10;
  currentPage: number = 1;
  itemsPerPage: number = 4;
  sortOption: string = 'All';
  searchQuery: string = '';
  showDropdown: boolean = false;
  category: any;
  defaultImage = '../../../../assets/images/default-img.gif';
  cardData: any[] = [];
  imageData: any[] = [];
  filteredCategories: any[] = [];
  branches: any[] = [];
  priceRanges: string[] = ['0-50', '51-100', '101-200'];
  selectedBranch: string = '';
  filteredCards: any[] = [];
  selectedPriceRange: string = '';
  filterVisible: boolean = false;
  activeDropdownIndex: number | null = null;

  getTruncatedAddress(address: string): string {
    if (!address) return '';
    const words = address.split(' ');
    if (words.length <= 3) return address;
    return words.slice(0, 3).join(' ') + '...';
  }
  getTruncatedName(name: string): string {
    if (!name) return '';
    const words = name.split(' ');
    if (words.length <= 3) return name;
    return words.slice(0, 3).join(' ') + '...';
  }
  toggleDropdown(index: number) {
    this.activeDropdownIndex =
      this.activeDropdownIndex === index ? null : index;
  }
  editBranch(hallId: string) {
    this.router.navigate(['/hall-manage/edit-hall', hallId]);
    window.scrollTo({
      top: 0,
      behavior: 'smooth', // Smooth scrolling animation
    });
  }
  viewBranch(hallId: string) {
    this.router.navigate(['/hall-manage/hall-detail', hallId]);
    window.scrollTo({
      top: 0,
      behavior: 'smooth', // Smooth scrolling animation
    });
  }

  constructor(private apiService: ApiService, private router: Router) {}
  ngOnInit(): void {
    this.getHallData();
    this.getAllBranches();
  }
  nextSlide(user: newUser) {
    user.currentIndex = (user.currentIndex + 1) % user.image.length;
  }

  prevSlide(user: newUser) {
    user.currentIndex =
      (user.currentIndex - 1 + user.image.length) % user.image.length;
  }

  getHallData() {
    let url = new URL(`${environment.baseURL}/api/hall/sub-hall/sub-halls`);
    this.apiService.get(url.href).subscribe(
      (response) => {
        // this.cardData = response.halls;

        this.cardData = response.halls.map((hall: any) => ({
          ...hall,
          truncatedName: this.getTruncatedAddress(hall.hall_title),
          truncatedAddress: this.getTruncatedAddress(
            hall.address[0].street_adress
          ),
        }));
        this.filteredCategories = [...this.cardData];
        this.selectedBranch = '';
        this.paginateData();
      },
      (error) => {
        console.log(error);
      }
    );
  }
  deleteBranch(cardId: string, index: number) {
    const url = `https://dev-backend.hamaravenue.com/api/hall/sub-hall/sub-hall/${cardId}`;

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
                text: 'Hall has been deleted.',
                icon: 'success',
              });

              // Update your data after successful deletion
              this.filteredCategories = this.filteredCategories.filter(
                (branch) => branch._id !== cardId
              );
              if (this.activeDropdownIndex === index) {
                this.activeDropdownIndex = null; // Close the dropdown
              }
              this.getHallData();
              this.paginateData();
              console.log('Hall deleted successfully');
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

  navigateToAddHall() {
    this.router.navigate(['hall-manage/add-hall']);
  }
  navigateToDetail(data: any) {
    this.router.navigate(['hall-detail', data.id], {
      state: { data },
    });
  }
  ngAfterViewInit(): void {
    this.carouselElements.changes.subscribe(() => {
      this.carouselElements.forEach((carousel) => {
        $(carousel.nativeElement).carousel();
      });
    });
  }
  //buttons

  toggleFilter() {
    this.filterVisible = !this.filterVisible;
  }

  closeFilters(event: Event): void {
    event.stopPropagation();
    this.filterVisible = false;
    this.selectedBranch = '';
    this.getHallData();
  }

  stopPropagation(event: Event): void {
    event.stopPropagation();
  }
  sortBy(option: string) {
    if (option === 'ascending') {
      this.cardData.sort((a, b) =>
        a.hall_title && b.hall_title
          ? a.hall_title.localeCompare(b.hall_title)
          : 0
      );
      this.sortOption = 'Ascending';
    } else if (option === 'descending') {
      this.cardData.sort((a, b) =>
        a.hall_title && b.hall_title
          ? b.hall_title.localeCompare(a.hall_title)
          : 0
      );
      this.sortOption = 'Descending';
    } else if (option === 'all') {
      // Display the "All" option when sorting by both ascending and descending
      this.cardData.sort((a, b) =>
        a.hall_title && b.hall_title
          ? a.hall_title.localeCompare(b.hall_title)
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
  //search
  onSearchChange() {
    if (!this.searchQuery) {
      this.filteredCategories = [...this.cardData];
      this.getHallData();
      return;
    }
    this.filteredCategories = this.cardData.filter((category) =>
      category.hall_title.toLowerCase().includes(this.searchQuery.toLowerCase())
    );
  }

  filterByAlphabet(alphabet: string) {
    if (alphabet === 'all') {
      this.filteredCategories = [...this.cardData]; // Reset to all categories
    } else {
      // Filter categories that start with the selected alphabet
      this.filteredCategories = this.cardData.filter((category) =>
        category.hall_title.toLowerCase().startsWith(alphabet.toLowerCase())
      );
    }
    this.searchQuery = '';
    this.showDropdown = false;
    this.getHallData();
  }
  //pagination
  paginateData() {
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    const endIndex = startIndex + this.itemsPerPage;
    this.filteredCategories = this.cardData.slice(startIndex, endIndex);
  }
  get totalPages(): number {
    return Math.ceil(this.cardData.length / this.itemsPerPage);
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
  //filter branches

  getAllBranches() {
    let url = `${environment.baseURL}/api/hall/sub-hall/sub-hall/select`;

    this.apiService
      .get(url)
      .pipe(first())
      .subscribe(
        (response: any) => {
          this.branches = response.branches.map((branch: any) => ({
            _id: branch._id,
            hall_title: branch.hall_title,
          }));
        },
        (error) => {
          console.log(error);
          // Handle error appropriately, e.g., show a message
        }
      );
  }

  filterByBranch(): void {
    if (this.selectedBranch) {
      this.filteredCategories = this.cardData.filter(
        (card) => card._id === this.selectedBranch
      );
    } else {
      this.filteredCategories = this.cardData;
    }
  }
}
