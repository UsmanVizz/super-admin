import {
  Component,
  OnInit,
  ViewChildren,
  QueryList,
  AfterViewInit,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import {
  FormBuilder,
  Validators,
  FormGroup,
  ReactiveFormsModule,
} from '@angular/forms';
import { environment } from 'src/environment/environment';
import { ApiService } from 'src/app/services/api-services.service';
import { first } from 'rxjs';
import { ActivatedRoute } from '@angular/router';
declare let $: any;
@Component({
  selector: 'app-branch-detail',
  templateUrl: './branch-detail.component.html',
  styleUrls: ['./branch-detail.component.scss'],
  standalone: true,
  imports: [CommonModule, RouterModule, ReactiveFormsModule],
})
export class BranchDetailComponent implements OnInit, AfterViewInit {
  @ViewChildren('carouselElement') carouselElements: QueryList<any> =
    new QueryList();
  imagesToUpload: any[] = [];
  uploadedImages: any[] = [];
  branch_images: any;
  branchForm: FormGroup;
  data: any;
  newData: any;
  i: number = 0;
  branchData: any;
  pakCityList: any;

  constructor(
    private formBuilder: FormBuilder,
    private apiService: ApiService,
    private router: Router,
    private routes: ActivatedRoute
  ) {
    this.branchForm = this.formBuilder.group({
      branch_name: ['', Validators.required],
      branch_Id: ['', Validators.required],
      branch_description: ['', Validators.required],
      branch_address: ['', Validators.required],
      parking_capacity: ['', Validators.required],
      branch_type: ['', Validators.required],
      branch_city: ['', Validators.required],
      branch_contact: ['', Validators.required],
      branch_geocordinate: ['', Validators.required],
    });
  }

  defaultImage = '../../../../assets/images/default-img.gif';

  ngOnInit(): void {
    this.routes.params.subscribe((params) => {
      const id = params['id'];
      console.log('Branch ID:', id);
      this.getBranchData(id);
    });
  }
  manageBranch() {
    this.router.navigate(['/branch-manage']);
  }
  editBranch(branchId: string) {
    this.router.navigate(['/branch-manage/edit-branch', branchId]);
  }
  getBranchData(id: any) {
    const url = new URL(`${environment.baseURL}/api/hall/branch/branch/${id}`);
    this.apiService
      .get(url.href)
      .pipe(first())
      .subscribe(
        (response: any) => {
          const branchData = response.branch;
          this.branchData = branchData;
          console.log(this.branchData, ' this.branchData ');
        },
        (error) => {
          console.error('Error fetching branch data:', error);
        }
      );
  }
  ngAfterViewInit(): void {
    this.carouselElements.changes.subscribe(() => {
      this.carouselElements.forEach((carousel) => {
        $(carousel.nativeElement).carousel();
      });
    });
  }
}
