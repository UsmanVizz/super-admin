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
  selector: 'app-manage-companies',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule, LazyLoadImageModule],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  templateUrl: './manage-companies.component.html',
  styleUrls: ['./manage-companies.component.scss'],
})
export class ManageCompaniesComponent implements OnInit {
  selectedButton: string = 'all';
  tableData: any[] = [];
  constructor(private router: Router, private apiService: ApiService) {}
  ngOnInit(): void {
    this.getAllCategories();
  }

  getAllCategories(page: number = 1): void {
    const url = new URL(`${environment.baseURL}/api/admin/company/company`);

    this.apiService
      .get(url.href)
      .pipe(first())
      .subscribe(
        (response: any) => {
          if (response.data && response.data.length) {
            this.tableData = response.data.map((item: any, index: number) => {
              return {
                ...item,
                index: index,
              };
            });
            console.log('tableData', this.tableData);
          } else {
            this.tableData = [];
          }
        },
        (error) => {
          console.error('Error fetching categories:', error);
          this.tableData = [];
        }
      );
  }

  viewCompany(userId: string) {
    this.router.navigate(['companies-management/company-detail', userId]);
    console.log('call function');
  }
  editCompany(userId: string) {
    this.router.navigate(['companies-management/edit-company', userId]);
    console.log('call function');
  }

  deleteCategory(cardId: string) {
    const url = `https://dev-backend.hamaravenue.com/api/admin/company/company/${cardId}`;

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
              Swal.fire({
                title: 'Deleted!',
                text: 'Hall has been deleted.',
                icon: 'success',
              });
              this.getAllCategories();

              console.log('Hall deleted successfully');
            },
            (error) => {
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
  selectButton(button: string) {
    this.selectedButton = button;
    if (button === 'branch') {
      this.router.navigate(['/branch-manage']);
    }
    if (button === 'hall') {
      this.router.navigate(['/hall-manage']);
    }
  }

  addCompanies() {
    this.router.navigate(['/companies-management/add-company']);
  }
}
