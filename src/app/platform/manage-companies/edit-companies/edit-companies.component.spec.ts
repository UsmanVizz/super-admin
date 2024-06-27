import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditCompaniesComponent } from './edit-companies.component';

describe('EditCompaniesComponent', () => {
  let component: EditCompaniesComponent;
  let fixture: ComponentFixture<EditCompaniesComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [EditCompaniesComponent]
    });
    fixture = TestBed.createComponent(EditCompaniesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
