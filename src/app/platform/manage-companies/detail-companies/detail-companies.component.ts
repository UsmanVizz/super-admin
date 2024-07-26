import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { ActivatedRoute } from '@angular/router';
import { environment } from 'src/environment/environment';
import { ApiService } from 'src/app/services/api-services.service';
import { first } from 'rxjs';

@Component({
  selector: 'app-detail-companies',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './detail-companies.component.html',
  styleUrls: ['./detail-companies.component.scss'],
})
export class DetailCompaniesComponent {
  dropdownOpen: boolean = false;
  tableData: any;
  constructor(
    private router: Router,
    private apiService: ApiService,
    private routes: ActivatedRoute
  ) {}
  ngOnInit(): void {
    this.routes.params.subscribe((params) => {
      const id = params['id'];
      console.log('Branch ID:', id);
      this.getAllCompanies(id);
    });
  }
  getAllCompanies(page: number = 1): void {
    const url = new URL(`${environment.baseURL}/api/admin/company/company`);

    this.apiService
      .get(url.href)
      .pipe(first())
      .subscribe(
        (response: any) => {
          this.tableData = response.data[0];
          console.log('tableData', this.tableData);
        },
        (error) => {
          console.error('Error fetching categories:', error);
          this.tableData = [];
        }
      );
  }
  toggleDropdown() {
    this.dropdownOpen = !this.dropdownOpen;
  }

  customerDetail() {
    this.router.navigate(['/companies-management']);
  }
}
