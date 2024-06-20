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
  ],
})
export class OthModule { }
