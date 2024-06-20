import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../environment/environment';

@Injectable({
  providedIn: 'root',
})
export class CategoryService {
  addImageAPi =
    environment.baseURL +
    '/api/hall/menu_category/upload-images?fileType=images';

  private categoryServiceUrl =
    'https://dev-backend.hamaravenue.com/api/hall/menu_category/menu_category';

  constructor(private http: HttpClient) {}
  getManageBranch(): Observable<any> {
    return this.http.get(this.categoryServiceUrl);
  }

  // New method to handle the API call with a branch_id parameter
  getMenuCategory(branchId: string): Observable<any> {
    const params = new HttpParams().set('branch_id', branchId);
    return this.http.get<any>(this.categoryServiceUrl, { params });
  }

  addCategory(categoryData: any): Observable<any> {
    return this.http.post(this.categoryServiceUrl, categoryData);
  }

  updateManageBranch(id: number, newData: any): Observable<any> {
    return this.http.put(`${this.categoryServiceUrl}/${id}`, newData);
  }

  deleteBranch(id?: any): Observable<any> {
    const url = `${this.categoryServiceUrl}/${id}`;
    return this.http.delete(url);
  }

  uploadImage(formData: FormData): Observable<any> {
    return this.http.post<any>(`${environment.imageUrl}`, formData);
  }

  uploadThumbnail(formData: FormData): Observable<any> {
    return this.http.post<any>(`${environment.thumbnailUrl}`, formData);
  }
}
