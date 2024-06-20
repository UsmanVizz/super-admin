import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { OthRoutingModule } from './oth-routing.module';
import { IndexComponent } from './index/index.component';
import { DefaultPageComponent } from './default-page/default-page.component';

@NgModule({
  declarations: [IndexComponent, DefaultPageComponent],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    OthRoutingModule,

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
export class OthModule {}
