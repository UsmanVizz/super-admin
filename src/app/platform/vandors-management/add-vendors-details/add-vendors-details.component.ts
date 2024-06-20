import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

interface Deliverables {
  name: string;
  image: string;
  selected: boolean;
}

@Component({
  selector: 'app-add-vendors-details',
  templateUrl: './add-vendors-details.component.html',
  styleUrls: ['./add-vendors-details.component.scss'],
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule, ReactiveFormsModule],
})
export class AddVendorsDetailsComponent implements OnInit {
  vendorsDetails: any;
  showDeliverables: boolean = false;
  deliverables: Deliverables[] = [];

  constructor(private router: Router) {}
  manageVendor() {
    this.router.navigate(['/vandors']);
  }
  ngOnInit(): void {
    this.vendorsDetails = [
      {
        vendorType: 'Vendor Name',
        imageIUrl: '../../../../assets/images/icons/text.png',
        detail: 'Title of Hall',
      },
      {
        vendorType: 'Vendor Type',
        imageIUrl: '../../../../assets/images/icons/photographer.png',
        detail: 'Photography',
      },
      {
        vendorType: 'Contact No',
        imageIUrl: '../../../../assets/images/icons/call.png',
        detail: '+92 345-7890908',
      },
      {
        vendorType: 'Email',
        imageIUrl: '../../../../assets/images/icons/file-text.png',
        detail: 'maryellen6586@.com',
      },
      {
        vendorType: 'Address On Map',
        imageIUrl: '../../../../assets/images/icons/address-map.png',
        detail: 'https://maps.app.goo.gl hAmycsm Y1YNmrw4ZA',
      },
    ];

    this.deliverables = [
      {
        name: 'Video',
        image: '../../../../assets/images/icons/dj.png',
        selected: false,
      },
      {
        name: 'Images',
        image: '../../../../assets/images/icons/dj.png',
        selected: false,
      },
    ];
  }

  toggleDeliverables() {
    this.showDeliverables = !this.showDeliverables;
  }

  getDeliverablesName() {
    const selectedDeliverable = this.deliverables.filter(
      (deliverable) => deliverable.selected
    );
    if (selectedDeliverable.length === 0) {
      return 'Select Vendor Type';
    } else if (selectedDeliverable.length === 1) {
      return selectedDeliverable[0].name;
    } else {
      return selectedDeliverable
        .map((deliverable) => deliverable.name)
        .join(', ');
    }
  }
}
