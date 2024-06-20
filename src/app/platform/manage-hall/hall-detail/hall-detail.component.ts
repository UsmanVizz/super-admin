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
  selector: 'app-hall-detail',
  standalone: true,
  imports: [CommonModule, RouterModule, ReactiveFormsModule],
  templateUrl: './hall-detail.component.html',
  styleUrls: ['./hall-detail.component.scss'],
})
export class HallDetailComponent implements OnInit, AfterViewInit {
  @ViewChildren('carouselElement') carouselElements: QueryList<any> =
    new QueryList();
  imagesToUpload: any[] = [];
  uploadedImages: any[] = [];
  branch_images: any;
  branchForm: FormGroup;
  data: any;
  newData: any;
  i: number = 0;
  hallData: any;
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
      this.getHallData(id);
    });
  }
  getHallData(id: any) {
    const url = new URL(
      `${environment.baseURL}/api/hall/sub-hall/sub-hall/${id}`
    );
    this.apiService
      .get(url.href)
      .pipe(first())
      .subscribe(
        (response: any) => {
          const hallData = response.subHall;
          this.hallData = hallData;
          console.log(hallData.images, 'hallData');
        },
        (error) => {
          console.error('Error fetching branch data:', error);
        }
      );
  }
  editBranch(hallId: string) {
    this.router.navigate(['/hall-manage/edit-hall', hallId]);
  }
  ngAfterViewInit(): void {
    this.carouselElements.changes.subscribe(() => {
      this.carouselElements.forEach((carousel) => {
        $(carousel.nativeElement).carousel();
      });
    });
  }
}
