import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuardService } from './services/auth-guard.service';
const routes: Routes = [
  {
    path: 'auth',
    loadChildren: () => import('./oth/oth.module').then((m) => m.OthModule),
  },

  {
    path: '',
    loadChildren: () =>
      import('./main-page/mainpage.module').then((m) => m.MainModule),
    canActivate: [AuthGuardService],
  },
  {
    path: 'generate-report',
    loadComponent: () =>
      import('./shared/generate-report/generate-report.component').then(
        (m) => m.GenerateReportComponent
      ),

    canActivate: [AuthGuardService],
  },
  {
    path: '**',
    redirectTo: '',
    pathMatch: 'full',
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
