import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../environment/environment';

@Injectable({
  providedIn: 'root',
})
export class MenuServiceService {
  addImageAPi =
    environment.baseURL +
    '/api/hall/menu_category/upload-images?fileType=images';

  private menuServiceUrl =
    'https://dev-backend.hamaravenue.com/api/hall/menu_item/menu_item';

  constructor(private http: HttpClient) {}
  getManageBranch(): Observable<any> {
    return this.http.get(this.menuServiceUrl);
  }

  // New method to handle the API call with a branch_id parameter
  getMenu(branchId: string): Observable<any> {
    const params = new HttpParams().set('branch_id', branchId);
    return this.http.get<any>(this.menuServiceUrl, { params });
  }

  addMenu(menuData: any): Observable<any> {
    return this.http.post(this.menuServiceUrl, menuData);
  }

  updateManageManu(id: number, newData: any): Observable<any> {
    return this.http.put(`${this.menuServiceUrl}/${id}`, newData);
  }

  deleteMenu(id?: any): Observable<any> {
    const url = `${this.menuServiceUrl}/${id}`;
    return this.http.delete(url);
  }

  uploadImage(formData: FormData): Observable<any> {
    return this.http.post<any>(`${environment.imageUrl}`, formData);
  }

  uploadThumbnail(formData: FormData): Observable<any> {
    return this.http.post<any>(`${environment.thumbnailUrl}`, formData);
  }
}
