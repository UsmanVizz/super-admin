import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../environment/environment';

@Injectable({
  providedIn: 'root',
})
export class UserManagmentService {
  addUsersApi =
    environment.baseURL + '/api/hall/user_management/user_management';

  deleteUsersApi =
    environment.baseURL + '/api/hall/user_management/user_management/';

  updateUsersApi =
    environment.baseURL + '/api/hall/user_management/user_management/';

  constructor(private http: HttpClient) {}

  getUsersImg(formData: FormData): Observable<any> {
    return this.http.post(environment.userManagementImag, formData);
  }

  addNewUsers(data: any): Observable<any> {
    return this.http.post(this.addUsersApi, data);
  }

  deleteUsers(id: string): Observable<any> {
    const url = `${this.deleteUsersApi}${id}`;
    return this.http.delete(url);
  }

  updateUsers(id: string, data: any): Observable<any> {
    const url = `${this.updateUsersApi}${id}`;
    return this.http.put(url, data);
  }

  updateUserDp(formData: FormData): Observable<any> {
    return this.http.post(`${environment.updateProfileImg}`, formData);
  }
}
