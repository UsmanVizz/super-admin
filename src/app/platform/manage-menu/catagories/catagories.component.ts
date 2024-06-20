import { CommonModule } from '@angular/common';
// import { InputSwitchModule } from 'primeng/inputswitch';
import { Component, CUSTOM_ELEMENTS_SCHEMA, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import {
  AfterViewInit,
  Renderer2,
  ViewChild,
  ElementRef,
  Input,
} from '@angular/core';
import { environment } from '../../../../environment/environment';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CategoryService } from '../../../services/category.service';

import { first } from 'rxjs';
import { ApiService, ApiResponse } from 'src/app/services/api-services.service';
import Swal from 'sweetalert2';
declare interface JQuery<TElement extends HTMLElement> {
  carousel(): JQuery<TElement>;
}

declare let $: any;
@Component({
  selector: 'app-catagories',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './catagories.component.html',
  styleUrls: ['./catagories.component.scss'],
})
export class CatagoriesComponent implements OnInit {
  @Input() category: any;
  @ViewChild('filterButton', { static: false }) filterButton!: ElementRef;
  @ViewChild('filterContainer', { static: false }) filterContainer!: ElementRef;

  @ViewChild('cardTextContainer') cardTextContainer!: ElementRef;
  checked: boolean = false;
  activeIndex: number = 0;
  selectedMenu: string = '';
  branches: any[] = [];
  cards: any[] = [];
  currentPage: number = 1;
  itemsPerPage: number = 4;
  totalItems: number = 0;
  selectedButton: string = 'category';
  filterVisible: boolean = false;
  sortOption: string = 'All';
  searchQuery: string = '';
  showDropdown: boolean = false;
  selectedBranch: string = '';
  filteredCategories: any[] = [];
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
  constructor(
    private router: Router,
    private elementRef: ElementRef,
    private renderer: Renderer2,
    private categoryService: CategoryService,
    private apiService: ApiService
  ) {}

  ngOnInit(): void {
    this.getAllCategories();
  }
  trackByFn(index: number, item: any): number {
    return item.id;
  }
  getAllCategories() {
    let url = new URL(
      `${environment.baseURL}/api/hall/menu_category/menu_category`
    );
    this.apiService
      .get(url.href)
      .pipe(first())
      .subscribe(
        (response: any) => {
          this.cards = response.data;
          this.filteredCategories = [...this.cards];
          this.selectedBranch = '';
          this.paginateData();
        },
        (error: any) => {
          console.log(error);
        }
      );
  }

  deleteCategory(categoryId: string): void {
    const url = `${environment.baseURL}/api/hall/menu_category/menu_category/${categoryId}`;

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
            () => {
              Swal.fire({
                title: 'Deleted!',
                text: 'Category has been deleted.',
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

              this.getAllCategories();
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

  //view
  viewCategory(categoryId: string) {
    this.router.navigate(['/manage-menu/catagories/view-category', categoryId]);
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  }
  ///edit
  editCategory(categoryId: string) {
    this.router.navigate(['/manage-menu/catagories/edit-category', categoryId]);

    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  }

  navigateToAddCategory() {
    this.router.navigate(['/manage-menu/catagories/add-category']);
  }

  setActiveIndex(index: number) {
    this.activeIndex = index;
  }
  ngAfterViewInit(): void {
    // Check if cardTextContainer is defined before accessing nativeElement
    if (this.cardTextContainer) {
      const container = this.cardTextContainer.nativeElement;
      const lineHeight = parseInt(
        window.getComputedStyle(container).lineHeight
      );
      const maxLines = Math.floor(container.clientHeight / lineHeight);

      this.renderer.setStyle(container, 'overflow', 'hidden');
      this.renderer.setStyle(container, 'display', '-webkit-box');
      this.renderer.setStyle(container, '-webkit-box-orient', 'vertical');
      this.renderer.setStyle(
        container,
        '-webkit-line-clamp',
        maxLines.toString()
      );
    }
  }

  //buttons

  toggleFilter() {
    this.filterVisible = !this.filterVisible;
  }

  closeFilters(event: Event): void {
    event.stopPropagation();
    this.filterVisible = false;
    this.selectedBranch = '';
    this.getAllCategories();
  }

  stopPropagation(event: Event): void {
    event.stopPropagation();
  }
  sortBy(option: string) {
    if (option === 'ascending') {
      this.cards.sort((a, b) =>
        a.category_name && b.category_name
          ? a.category_name.localeCompare(b.category_name)
          : 0
      );
      this.sortOption = 'Ascending';
    } else if (option === 'descending') {
      this.cards.sort((a, b) =>
        a.category_name && b.category_name
          ? b.category_name.localeCompare(a.category_name)
          : 0
      );
      this.sortOption = 'Descending';
    } else if (option === 'all') {
      // Display the "All" option when sorting by both ascending and descending
      this.cards.sort((a, b) =>
        a.category_name && b.category_name
          ? a.category_name.localeCompare(b.category_name)
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
      this.filteredCategories = [...this.cards];
      this.getAllCategories();
      return;
    }
    this.filteredCategories = this.cards.filter((category) =>
      category.category_name
        .toLowerCase()
        .includes(this.searchQuery.toLowerCase())
    );
  }

  filterByAlphabet(alphabet: string) {
    if (alphabet === 'all') {
      this.filteredCategories = [...this.cards]; // Reset to all categories
    } else {
      // Filter categories that start with the selected alphabet
      this.filteredCategories = this.cards.filter((category) =>
        category.category_name.toLowerCase().startsWith(alphabet.toLowerCase())
      );
    }
    this.searchQuery = '';
    this.showDropdown = false;
    this.getAllCategories();
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
  //filter
  positionFilterContainer() {
    const buttonRect = this.filterButton.nativeElement.getBoundingClientRect();
    const filterContainer = this.filterContainer.nativeElement;

    filterContainer.style.top = `${buttonRect.bottom}px`;
    filterContainer.style.left = `${buttonRect.left}px`;
  }
  getFilterMenu(branchId: string) {
    const url = `${environment.baseURL}/api/hall/menu_category/menu_category?branch_id=${branchId}`;

    this.apiService
      .get(url)
      .pipe(first())
      .subscribe(
        (response: any) => {
          this.cards = response.data.map((menu: any) => ({
            _id: menu._id,
            category_name: menu.category_name,
          }));
          console.log('this.cards', this.cards);
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
      console.log(' this.filteredCategories', this.filteredCategories);
    } else {
      this.filteredCategories = this.cards;
    }
  }
}
