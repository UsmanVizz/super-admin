import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import {
  FormsModule,
  ReactiveFormsModule,
  FormGroup,
  FormBuilder,
  FormArray,
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
@Component({
  selector: 'app-add-booking-menu',
  templateUrl: './add-booking-menu.component.html',
  styleUrls: ['./add-booking-menu.component.scss'],
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
})
export class AddBookingMenuComponent implements OnInit {
  createItem!: FormGroup;
  addDeals() {
    this.router.navigate(['/deals']);
    this.toastr.success('Category created successfully!', '', {
      timeOut: 2000,
    });
  }
  addbookingTeam() {
    this.router.navigate(['/add-booking-team']);
  }
  cardsData = [
    { title: 'Sea Food', imageUrl: 'assets/food/images/food-1.jpg' },
    { title: 'Bar B.Q', imageUrl: 'assets/food/images/food-1.jpg' },
    { title: 'Rice', imageUrl: 'assets/food/images/food-1.jpg' },
    { title: 'Sea Food', imageUrl: 'assets/food/images/food-1.jpg' },
    { title: 'Bar B.Q', imageUrl: 'assets/food/images/food-1.jpg' },
    { title: 'Rice', imageUrl: 'assets/food/images/food-1.jpg' },
    { title: 'Sea Food', imageUrl: 'assets/food/images/food-1.jpg' },
  ];
  selectedCards: boolean[] = [];
  toggleSelection(index: number) {
    this.selectedCards[index] = !this.selectedCards[index];
    console.log('ddd');
  }

  isSelected(index: number): boolean {
    return this.selectedCards[index];
  }
  panelOpenState: boolean = false;

  counter: number = 0;

  selectCategory: any;

  items = [
    'Fresh Harvest Bistro',
    'Garden Greens Grill',
    'Farm-to-Table Feast',
    'Orchard Oasis Café',
    'Crisp Cuisine Corner',

    'Farmhouse Flavors Restaurant',
  ];

  basket = ['Veggie Delight Diner'];

  constructor(
    private router: Router,
    private toastr: ToastrService,
    private fb: FormBuilder
  ) {
    this.createItem = this.fb.group({
      menuItems: this.fb.array([]),
    });

    this.selectCategory = [
      {
        name: 'Chicken korma',
        imageUrl: '../../../../assets/menu-categories/image-1.png',
      },
      {
        name: 'Bar B. Q',
        imageUrl: '../../../../assets/menu-categories/image-2.png',
      },
      {
        name: 'Chicken korma',
        imageUrl: '../../../../assets/menu-categories/image-1.png',
      },
      {
        name: 'Bar B. Q',
        imageUrl: '../../../../assets/menu-categories/image-2.png',
      },
      {
        name: 'Chicken korma',
        imageUrl: '../../../../assets/menu-categories/image-1.png',
      },
      {
        name: 'Bar B. Q',
        imageUrl: '../../../../assets/menu-categories/image-2.png',
      },
    ];
  }

  ngOnInit(): void {}

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

    // If the item is found in the basket array
    if (index !== -1) {
      // Remove the item from the basket array
      this.basket.splice(index, 1);

      // Add the item to the items array
      this.items.push(item);

      // Optionally, you can update the form control value or perform any other necessary actions here
    }
  }

  // closeDialog() {
  //   this.dialogRef.close();
  // }

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
