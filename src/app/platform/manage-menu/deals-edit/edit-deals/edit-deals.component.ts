import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Router, ActivatedRoute } from '@angular/router';
import { MenuServiceService } from '../../../../services/menu-service.service';

import { first } from 'rxjs';
import {
  FormsModule,
  ReactiveFormsModule,
  FormGroup,
  FormBuilder,
  FormArray,
  Validators,
} from '@angular/forms';
import { DragDropModule } from '@angular/cdk/drag-drop';
import {
  CdkDrag,
  CdkDragDrop,
  CdkDropList,
  CdkDropListGroup,
  moveItemInArray,
  transferArrayItem,
} from '@angular/cdk/drag-drop';
import { environment } from '../../../../../environment/environment';
import { ApiService, ApiResponse } from 'src/app/services/api-services.service';

interface BranchName {
  name: string;
  selected: boolean;
}

interface MenuItem {
  _id: string;
  name: string;
  thumbnail_image: string;
  category_id: string;
}

@Component({
  selector: 'app-edit-deals',
  templateUrl: './edit-deals.component.html',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    DragDropModule,
    FormsModule,
    ReactiveFormsModule,
    CdkDropListGroup,
    CdkDropList,
    CdkDrag,
  ],
  styleUrls: ['./edit-deals.component.scss'],
})
export class EditDealsComponent implements OnInit {
  createItem!: FormGroup;
  showDropdown: boolean = false;
  branches: any[] = [];
  branchName: BranchName[] = [];
  cardsData: any[] = [];
  showBranchName: boolean = false;
  selectedBranchId: any;
  selectedCategory: any = null;
  items: any[] = [];
  basket: any[] = [];
  filteredCategories: any[] = [];
  selectedCategoryId: any;
  filteredItems: any[] = [];
  discount: number = 0;
  dealId: string | null = null;
  setThumbnail: string = '';
  uploadedthumbnail: any[] = [];
  defaultImage: string = '../../../../../assets/dashboard/profile-default.png'; // Path to your default image

  imageLoadError(event: any) {
    event.target.src = this.defaultImage;
  }
  manageMenu() {
    this.router.navigate(['/manage-menu/deals']);
  }
  ngOnInit() {
    this.route.paramMap.subscribe((params) => {
      this.dealId = params.get('id');
      if (this.dealId) {
        this.loadDeal(this.dealId);
      }
    });
    this.getAllBranches();
    this.getAllCategories();
    this.getAllItems(); // Fetch all items initially
  }

  // loadDeal(dealId: string) {
  //   let url = new URL(`${environment.baseURL}/api/hall/menu_deal/menu_deal/${dealId}`);
  //   this.apiService.get(url.href).pipe(first()).subscribe(
  //     (response: any) => {
  //       const deal = response.data;
  //       this.createItem.patchValue({
  //         deal_name: deal.deal_name,
  //         description: deal.description,
  //         branch_id: deal.branch_id,
  //         discount: deal.discount,
  //       });
  //       this.basket = deal.menu_items;
  //       this.selectedBranchId = deal.branch_id;
  //       this.filterCategoriesByBranch();
  //       this.filterItemsByCategory();
  //     },
  //     (error: any) => {
  //       console.log(error);
  //       this.toastr.error('Failed to load deal');
  //     }
  //   );
  // }
  loadDeal(dealId: string) {
    let url = new URL(
      `${environment.baseURL}/api/hall/menu_deal/menu_deal/${dealId}`
    );
    this.apiService
      .get(url.href)
      .pipe(first())
      .subscribe(
        (response: any) => {
          const deal = response.data;
          this.createItem.patchValue({
            deal_name: deal.deal_name,
            description: deal.description,
            branch_id: deal.branch_id,
            discount: deal.discount,
          });
          this.basket = deal.menu_items_detail.map((item: any) => ({
            _id: item._id,
            item_name: item.item_name,
            item_price_per_head: item.item_price_per_head,
            thumbnail_image: item.thumbnail_image,
          })); // Ensure all necessary properties are included
          this.selectedBranchId = deal.branch_id;
          this.filterCategoriesByBranch();
          this.filterItemsByCategory();
          console.log('Loaded deal:', deal);
          console.log('Basket items:', this.basket);
        },
        (error: any) => {
          console.log(error);
          this.toastr.error('Failed to load deal');
        }
      );
  }

  getAllBranches() {
    let url = new URL(`${environment.baseURL}/api/hall/branch/branches`);
    this.apiService
      .get(url.href)
      .pipe(first())
      .subscribe(
        (response: any) => {
          this.branches = response.branches.map((branch: any) => ({
            _id: branch._id,
            branch_name: branch.branch_name,
          }));
          console.log('all branches', this.branches);
        },
        (error: any) => {
          console.log(error);
        }
      );
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
          this.cardsData = response.data.map((menu: any) => ({
            _id: menu._id,
            category_name: menu.category_name,
            thumbnail_image: menu.thumbnail_image,
            branch_id: menu.branch_id,
          }));
          this.filteredCategories = this.cardsData;
          console.log('all categories', this.cardsData);
        },
        (error: any) => {
          console.log(error);
        }
      );
  }

  getAllItems() {
    let url = new URL(`${environment.baseURL}/api/hall/menu_item/menu_item`);
    this.apiService
      .get(url.href)
      .pipe(first())
      .subscribe(
        (response: any) => {
          this.items = response.data;
          // this.items = this.basket;
          console.log('all items', this.items);
          this.filterItemsByCategory();
        },
        (error: any) => {
          console.log(error);
        }
      );
  }

  onBranchSelect(event: any) {
    this.selectedBranchId = event.target.value;
    this.filterCategoriesByBranch();
  }

  filterCategoriesByBranch() {
    if (this.selectedBranchId) {
      this.filteredCategories = this.cardsData.filter(
        (category) => category.branch_id === this.selectedBranchId
      );
    } else {
      this.filteredCategories = this.cardsData;
    }
    console.log('filtered categories', this.filteredCategories);
    // Clear selected category if not found in filtered categories
    if (
      !this.filteredCategories.find(
        (cat) =>
          cat._id === (this.selectedCategory ? this.selectedCategory._id : null)
      )
    ) {
      this.selectedCategory = null;
    }
    // Filter items when branch changes
    this.filterItemsByCategory();
  }

  toggleSelection(index: number) {
    this.selectedCategory = this.filteredCategories[index];
    this.filterItemsByCategory();
  }

  filterItemsByCategory() {
    if (this.selectedCategory) {
      this.filteredItems = this.items.filter(
        (item) => item.category_id === this.selectedCategory._id
      );
    } else {
      this.filteredItems = [];
    }
    console.log('filtered items', this.filteredItems);
  }

  isSelected(index: number): boolean {
    return (
      this.selectedCategory &&
      this.selectedCategory._id === this.filteredCategories[index]._id
    );
  }

  panelOpenState: boolean = false;

  counter: number = 0;

  selectCategory: any;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private toastr: ToastrService,
    private fb: FormBuilder,
    private menuService: MenuServiceService,
    private apiService: ApiService
  ) {
    this.createItem = this.fb.group({
      deal_name: ['', Validators.required],
      description: [''],
      branch_id: ['', Validators.required],
      standard_price: [''],
      discount: [''],
      menu_items: [[]],
    });
  }

  get menuItems() {
    return this.createItem.get('menuItems') as FormArray;
  }

  trackByFn(index: number, item: any): any {
    return index;
  }

  addMenuItem() {
    this.menuItems.push(
      this.fb.group({
        name: '',
        description: '',
        price: '',
        counter: 0,
      })
    );
  }

  removeMenuItem(index: number) {
    this.menuItems.removeAt(index);
  }

  drop(event: CdkDragDrop<string[]>) {
    if (event.previousContainer === event.container) {
      moveItemInArray(
        event.container.data,
        event.previousIndex,
        event.currentIndex
      );
      console.log('Array move');
    } else {
      transferArrayItem(
        event.previousContainer.data,
        event.container.data,
        event.previousIndex,
        event.currentIndex
      );
      console.log('Item transferred');
    }
  }

  addSelectItem(item: string) {
    // Find the index of the item in the items array
    const index = this.items.indexOf(item);
    console.log('item', this.items);
    // If the item is found in the items array
    if (index !== -1) {
      // Remove the item from the items array
      this.items.splice(index, 1);

      // Add the item to the basket array
      this.basket.push(item);

      // Optionally, you can update the form control value or perform any other necessary actions here
    }
  }

  returnSelectedItem(item: string) {
    const index = this.basket.indexOf(item);
    console.log('basket', this.basket);
    // If the item is found in the basket array
    if (index !== -1) {
      // Remove the item from the basket array
      this.basket.splice(index, 1);

      // Add the item to the items array
      this.items.push(item);

      // Optionally, you can update the form control value or perform any other necessary actions here
    }
  }
  calculateTotalPrice(): number {
    let totalPrice = 0;
    this.basket.forEach((item) => {
      totalPrice += item.item_price_per_head; // Adjust this based on your item structure
    });
    return totalPrice;
  }

  calculateFinalPrice(): number {
    const totalPrice = this.calculateTotalPrice();
    const discountAmount = (totalPrice * this.discount) / 100;
    return totalPrice - discountAmount;
  }

  refreshBranches() {
    this.getAllBranches();
  }
  onThumbnailSelected(event: any): void {
    const files: FileList = event.target.files;
    if (files && files?.length > 0) {
      const allowedExtensions = ['jpg', 'jpeg', 'png'];
      const fileExtension = files[0].name.split('.').pop()?.toLowerCase();

      if (fileExtension && allowedExtensions.includes(fileExtension)) {
        const formData = new FormData();
        formData.append('thumbnail', files[0], files[0].name);

        this.menuService.uploadThumbnail(formData).subscribe(
          (res: any) => {
            // this.uploadedthumbnail.push(res);
            console.log('Upload successful Thumbnail', res.url);
            this.uploadedthumbnail = res?.[0]?.url;
            // this.uploadedthumbnail.push(res?.[0]?.url);
            this.setThumbnail = res?.[0]?.url;
            console.log('Uploaded Thumbnail URL ', this.setThumbnail);
          },
          (err) => {
            console.error('Error uploading image:', err);
          }
        );
      } else {
        console.error('Error: Invalid file type');
        this.toastr.error('Error: Invalid file type');
        alert('Please select files with valid extensions (.jpg, .jpeg, .png).');
      }
    }
  }

  removeThumbnail(image?: any): void {
    this.uploadedthumbnail = [];
  }

  saveDeal() {
    const formData = {
      deal_name: this.createItem.controls['deal_name'].value,
      description: this.createItem.controls['description'].value,
      branch_id: this.createItem.controls['branch_id'].value,
      standard_price: this.calculateTotalPrice(),
      discount: this.discount,
      final_price: this.calculateFinalPrice(),
      menu_items: this.basket.map((item) => item._id),
    };

    console.log('Form Data:', formData);

    if (this.dealId) {
      this.apiService
        .put(
          `${environment.baseURL}/api/hall/menu_deal/menu_deal/${this.dealId}`,
          formData
        )
        .pipe(first())
        .subscribe(
          (response: any) => {
            this.toastr.success('Deal updated successfully!', '', {
              timeOut: 2000,
            });
            this.router.navigate(['/manage-menu/deals']);
          },
          (error: any) => {
            console.log(error);
            this.toastr.error('Failed to update deal');
          }
        );
    }
  }
  createMenu() {
    const selectedItems = this.basket;

    const formData = {
      ...this.createItem.value,
      selectedItems: selectedItems,
    };

    console.log(formData);

    this.createItem.reset();
    // this.dialogRef.close();
  }
}
