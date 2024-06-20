import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Title } from '@angular/platform-browser';
import { environment } from '../../../../environment/environment';
import { first } from 'rxjs';
import {
  ApiResponse,
  ApiService,
} from '../../../services/api-services.service';
import { any } from '@amcharts/amcharts4/.internal/core/utils/Array';
@Component({
  selector: 'app-vandors-management',
  templateUrl: './vandors-management.component.html',
  styleUrls: ['./vandors-management.component.scss'],
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule, ReactiveFormsModule],
})
export class VandorsManagementComponent implements OnInit {
  currentPage: number = 1;
  itemsPerPage: number = 5;
  // vendorOffers: any[] = [];
  filteredVendors: any;
  chipItems: any = [
    {
      type: 'Type: ',
      value: 'Photographer',
    },
    {
      type: 'Locations: ',
      value: 'GT. Road',
    },
  ];

  getVendorData() {
    let url = new URL(`${environment.baseURL}/api/hall/branch/branches`);
    this.apiService
      .get(url.href)
      .pipe(first())
      .subscribe(
        (response) => {
          // this.menuCategories = response?.branches;
          this.vendorOffers = this.filteredVendors = [...this.vendorOffers];
        },
        (error) => {
          console.log(error);
        }
      );
  }
  vendorOffers: any = [
    {
      vendorName: 'Photographer 1',
      address: 'Main Blvd, Bahria Town Phase V Phase 5 Punjab Phase 4، ',
      rating: '5.0',
      starRating: 5,
      totalPrice: '2500',
      images: [
        {
          image1: '../../../../assets/images/vender-images/img1.png',
          image2: '../../../../assets/images/vender-images/img1.png',
          image3: '../../../../assets/images/vender-images/img1.png',
        },
      ],
    },
    {
      vendorName: 'Photographer 2',
      address: 'Main Blvd, Bahria Town Phase V Phase 5 Punjab Phase 4، ',
      rating: '5.0',
      starRating: 3,
      totalPrice: '2500',
      images: [
        {
          image1: '../../../../assets/images/vender-images/img1.png',
          image2: '../../../../assets/images/vender-images/img1.png',
          image3: '../../../../assets/images/vender-images/img1.png',
        },
      ],
    },
    {
      vendorName: 'Photographer 3',
      address: 'Main Blvd, Bahria Town Phase V Phase 5 Punjab Phase 4، ',
      rating: '5.0',
      starRating: 5,
      totalPrice: '2500',
      images: [
        {
          image1: '../../../../assets/images/vender-images/img1.png',
          image2: '../../../../assets/images/vender-images/img1.png',
          image3: '../../../../assets/images/vender-images/img1.png',
        },
      ],
    },
    {
      vendorName: 'Photographer 4',
      address: 'Main Blvd, Bahria Town Phase V Phase 5 Punjab Phase 4، ',
      rating: '5.0',
      starRating: 5,
      totalPrice: '2500',
      images: [
        {
          image1: '../../../../assets/images/vender-images/img1.png',
          image2: '../../../../assets/images/vender-images/img1.png',
          image3: '../../../../assets/images/vender-images/img1.png',
        },
      ],
    },
    {
      vendorName: 'Photographer 4',
      address: 'Main Blvd, Bahria Town Phase V Phase 5 Punjab Phase 4، ',
      rating: '5.0',
      starRating: 5,
      totalPrice: '2500',
      images: [
        {
          image1: '../../../../assets/images/vender-images/img1.png',
          image2: '../../../../assets/images/vender-images/img1.png',
          image3: '../../../../assets/images/vender-images/img1.png',
        },
      ],
    },
    {
      vendorName: 'Photographer 4',
      address: 'Main Blvd, Bahria Town Phase V Phase 5 Punjab Phase 4، ',
      rating: '5.0',
      starRating: 5,
      totalPrice: '2500',
      images: [
        {
          image1: '../../../../assets/images/vender-images/img1.png',
          image2: '../../../../assets/images/vender-images/img1.png',
          image3: '../../../../assets/images/vender-images/img1.png',
        },
      ],
    },
  ];

  constructor(
    private router: Router,
    private title: Title,
    private apiService: ApiService
  ) {}

  ngOnInit(): void {
    const shipsOrder = this.chipItems;
    shipsOrder.reverse();
    this.chipItems = shipsOrder;
    this.title.setTitle('Hamara Venue - Service Management');
  }

  addService() {
    this.router.navigate(['vandors/add-vendor']);
  }

  deleteChip(index: any) {
    this.chipItems.splice(index, 1);
  }

  clearAllChip() {
    this.chipItems = [];
  }

  get totalPages(): number {
    return Math.ceil(this.vendorOffers.length / this.itemsPerPage);
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
    }
  }

  nextPage(): void {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
    }
  }

  prevPage(): void {
    if (this.currentPage > 1) {
      this.currentPage--;
    }
  }

  get paginatedVendorOffers(): any[] {
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    const endIndex = startIndex + this.itemsPerPage;
    return this.vendorOffers.slice(startIndex, endIndex);
  }
}
