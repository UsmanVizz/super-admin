import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddBookingMenuComponent } from './add-booking-menu.component';

describe('AddBookingMenuComponent', () => {
  let component: AddBookingMenuComponent;
  let fixture: ComponentFixture<AddBookingMenuComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AddBookingMenuComponent]
    });
    fixture = TestBed.createComponent(AddBookingMenuComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
