// // api.service.ts
// import { Injectable } from '@angular/core';
// import { HttpClient } from '@angular/common/http';
// import { Observable } from 'rxjs';

// @Injectable({
//   providedIn: 'root',
// })
// export class ApiService {
//   constructor(private http: HttpClient) {}

//   getMenuCategories(): Observable<any[]> {
//     // const headers = new HttpHeaders({
//     //   'Content-Type': 'application/json',
//     //   Authorization: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzZXNzaW9uX2hhc2giOiI4M2RhY2ZkYWI2ZjY1OWUzMmY4NzhhODY3OWMwMzFhZSIsImlhdCI6MTcxNjQ2Mjg4N30.fD56lmhnxc2CIPveEdmPYO50jGClxPswF-xdZh-wjCQ`,
//     //   // Authorization: `Bearer ${token}`,
//     // });

//     return this.http.get<any[]>(
//       'https://dev-backend.hamaravenue.com//api/hall/branch/create-branch'
//     );
//   }
// }
