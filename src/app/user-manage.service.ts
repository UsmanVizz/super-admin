import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../environment/environment';

@Injectable({
  providedIn: 'root',
})
export class UserManageService {
  addUsersApi =
    environment.baseURL + '/api/vendor/user_management/user_management';

  constructor(private http: HttpClient) {}

  getUsersImg(formData: FormData): Observable<any> {
    return this.http.post(environment.userManagementImag, formData);
  }

  addNewUsers(data: any): Observable<any> {
    return this.http.post(this.addUsersApi, data);
  }
}
