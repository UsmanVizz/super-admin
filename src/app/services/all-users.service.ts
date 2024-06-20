import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, BehaviorSubject } from 'rxjs';
import { environment } from '../../environment/environment';

@Injectable({
  providedIn: 'root',
})
export class AllUsersService {
  private userDetailSubject: BehaviorSubject<any> = new BehaviorSubject<any>(
    null
  );
  userDetail$: Observable<any> = this.userDetailSubject.asObservable();
  private allUsersUrl = environment.baseURL + environment.getAllUsersApi;

  constructor(private http: HttpClient) {}

  getAllUsers(): Observable<any> {
    return this.http.get(this.allUsersUrl);
  }

  setUserDetail(userDetail: any): void {
    this.userDetailSubject.next(userDetail);
  }
}
