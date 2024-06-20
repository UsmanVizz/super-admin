import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MainPageRoutingModule } from './mainpage-routing.module';
import { MainPageComponent } from './main-page/main-page.component';
import { CdkMenuModule } from '@angular/cdk/menu';
import { SidebarComponent } from './layout/sidebar/sidebar.component';
import { HeaderComponent } from './layout/header/header.component';

@NgModule({
  declarations: [MainPageComponent],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MainPageRoutingModule,
    CdkMenuModule,
    SidebarComponent,
    HeaderComponent,
    // NgProgressModule.withConfig({
    //     spinner:false,
    //     color: "#426bf7",
    //     thick: true,
    // }),
    // NgProgressHttpModule,
    // ToastrModule.forRoot({
    //     timeOut: 10000,
    //     preventDuplicates: true,
    // }),
  ],
})
export class MainModule {}
