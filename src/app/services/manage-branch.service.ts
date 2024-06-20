import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ManageBranchService {
  constructor(private http: HttpClient) {}

  manageBranchUrl =
    'https://dev-backend.hamaravenue.com/api/hall/branch/branches';
  getManageBranch(): Observable<any> {
    return this.http.get(this.manageBranchUrl);
  }
  updateManageBranch(id: number, newData: any): Observable<any> {
    return this.http.put(`${this.manageBranchUrl}/${id}`, newData);
  }
  deleteBranch(id?: any): Observable<any> {
    const url = `https://dev-backend.hamaravenue.com/api/building/branch/${id}`;
    return this.http.delete(url);
  }
}
