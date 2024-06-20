import {
  HttpClient,
  HttpErrorResponse,
  HttpHeaders,
  HttpResponse,
} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Observable } from 'rxjs';
export interface ApiResponse {
  status: number;
  error?: string;
  message: string;
  err?: string;
  branches?: any;
  data?: any;
  halls?: any;
  amenities?: any;
}

@Injectable({
  providedIn: 'root',
})
export class ApiService {
  constructor(
    private http: HttpClient,
    private router: Router,
    private toastr: ToastrService
  ) {}

  public get(url: string) {
    return this.http.get<ApiResponse>(url);
  }

  public post(url: string, postData: any) {
    return this.http.post<ApiResponse>(url, postData);
  }

  public delete(url: string) {
    return this.http.delete<ApiResponse>(url);
  }

  public put(url: string, postData: any) {
    return this.http.put<ApiResponse>(url, postData);
  }

  public handleError(error: any) {
    if (error instanceof HttpErrorResponse) {
      const e: ApiResponse = {
        status: error.status,
        error: error.statusText,
        message: error.error['message'],
      };

      error = e;
    }
  }

  successToster(message: string, title: string) {
    this.toastr.success(message, title, {
      timeOut: 2000,
    });
  }

  errorToster(message: string, title: string) {
    this.toastr.error(message, title, {
      timeOut: 2000,
    });
  }

  infoToster(message: string, title: string) {
    this.toastr.info(message, title, {
      timeOut: 2000,
    });
  }

  warningToster(message: string, title: string) {
    this.toastr.warning(message, title, {
      timeOut: 5000,
    });
  }
}
