import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { environment } from '../../environment/environment';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AuthServiceService {
  public readonly USER_STORAGE_KEY = 'userId';
  public readonly USERNAME_STORAGE_KEY = 'userName';

  private loginUrl = environment.baseURL + environment.loginApi;

  signIn = ['/login'];
  constructor(private router: Router, private http: HttpClient) {}

  isLoggedIn(): boolean {
    return localStorage.getItem('user_token') ? true : false;
  }

  logout(): void {
    localStorage.removeItem('user');
    localStorage.removeItem('user_token');
    sessionStorage.removeItem('user');
    sessionStorage.removeItem('user_token');
    // this.router.navigate(this.signIn);
    // this.router.navigate(['/auth/login']);
  }

  getLoggedInUserName(): string | null {
    sessionStorage.getItem('user');
    const userDataString = localStorage.getItem('user');
    return userDataString ? JSON.parse(userDataString) : null;
  }

  // userSignup(obj: any): Observable<any> {
  //   return this.http.post(environment.baseURL + environment.signupApi, obj);
  // }

  userLoggedIn(obj: any): Observable<any> {
    return this.http.post(this.loginUrl, obj);
  }

  updateUserProfile(data: any): Observable<any> {
    return this.http.put(
      environment.baseURL + environment.updatePasswordApi,
      data
    );
  }
  sendPasswordResetEmail(email: string): Observable<any> {
    const url = `${environment.baseURL}/auth/hall/forgot-password`;
    return this.http.post<any>(url, { email });
  }
  getUserToken(): string | null {
    return localStorage.getItem('user_token');
  }
  updateUserDetails(data: any): Observable<any> {
    return this.http.put(
      `${environment.baseURL}/api/hall/profile/update-profile`,
      data
    );
  }
}
