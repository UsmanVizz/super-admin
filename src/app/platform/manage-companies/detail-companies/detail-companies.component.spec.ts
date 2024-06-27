import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DetailCompaniesComponent } from './detail-companies.component';

describe('DetailCompaniesComponent', () => {
  let component: DetailCompaniesComponent;
  let fixture: ComponentFixture<DetailCompaniesComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [DetailCompaniesComponent]
    });
    fixture = TestBed.createComponent(DetailCompaniesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
