import {
  Component,
  OnInit,
  ViewChildren,
  QueryList,
  AfterViewInit,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';
import { environment } from 'src/environment/environment';
import { ApiService } from 'src/app/services/api-services.service';
import { first } from 'rxjs';
import { ActivatedRoute } from '@angular/router';
declare let $: any;
@Component({
  selector: 'app-view-deals',
  templateUrl: './view-deals.component.html',
  styleUrls: ['./view-deals.component.scss'],
  standalone: true,
  imports: [CommonModule, RouterModule, ReactiveFormsModule],
})
export class ViewDealsComponent implements OnInit, AfterViewInit {
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
      this.getMenuData(id);
    });
  }
  getImageUrl(imageUrl: string): string {
    return 'https://dev-backend.hamaravenue.com' + imageUrl;
  }
  getMenuData(id: any) {
    const url = new URL(
      `${environment.baseURL}/api/hall/menu_deal/menu_deal/${id}`
    );
    this.apiService
      .get(url.href)
      .pipe(first())
      .subscribe(
        (response: any) => {
          const categoryData = response.data;
          this.categoryData = categoryData;
          console.log('categoryData', categoryData);
        },
        (error) => {
          console.error('Error fetching branch data:', error);
        }
      );
  }
  ///edit
  editCategory(categoryId: string) {
    this.router.navigate(['/manage-menu/deals-edit/edit-deals', categoryId]);

    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  }
  ngAfterViewInit(): void {
    this.carouselElements.changes.subscribe(() => {
      this.carouselElements.forEach((carousel) => {
        $(carousel.nativeElement).carousel();
      });
    });
  }
  manageMenu() {
    this.router.navigate(['/manage-menu/deals']);
  }
}
