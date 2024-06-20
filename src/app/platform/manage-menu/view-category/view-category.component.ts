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
  selector: 'app-view-category',
  templateUrl: './view-category.component.html',
  styleUrls: ['./view-category.component.scss'],
  standalone: true,
  imports: [CommonModule, RouterModule, ReactiveFormsModule],
})
export class ViewCategoryComponent implements OnInit, AfterViewInit {
  @ViewChildren('carouselElement') carouselElements: QueryList<any> =
    new QueryList();
  imagesToUpload: any[] = [];
  uploadedImages: any[] = [];
  branch_images: any;

  data: any;
  newData: any;
  i: number = 0;
  categoryData: any;
  pakCityList: any;

  constructor(
    private apiService: ApiService,
    private router: Router,
    private routes: ActivatedRoute
  ) {}

  defaultImage = '../../../../assets/images/default-img.gif';

  ngOnInit(): void {
    this.routes.params.subscribe((params) => {
      const id = params['id'];
      console.log('Branch ID:', id);
      this.getCategoryData(id);
    });
  }
  getImageUrl(imageUrl: string): string {
    return 'https://dev-backend.hamaravenue.com' + imageUrl;
  }
  getCategoryData(id: any) {
    const url = new URL(
      `${environment.baseURL}/api/hall/menu_category/menu_category/${id}`
    );
    this.apiService
      .get(url.href)
      .pipe(first())
      .subscribe(
        (response: any) => {
          const categoryData = response.data;
          this.categoryData = categoryData;
          console.log(categoryData.images, 'categoryData');
        },
        (error) => {
          console.error('Error fetching branch data:', error);
        }
      );
  }
  editBranch(hallId: string) {
    this.router.navigate(['/manage-menu/catagories/edit-category', hallId]);
  }
  ngAfterViewInit(): void {
    this.carouselElements.changes.subscribe(() => {
      this.carouselElements.forEach((carousel) => {
        $(carousel.nativeElement).carousel();
      });
    });
  }
}
