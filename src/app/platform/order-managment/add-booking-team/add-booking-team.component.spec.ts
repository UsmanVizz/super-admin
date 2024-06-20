import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddBookingTeamComponent } from './add-booking-team.component';

describe('AddBookingTeamComponent', () => {
  let component: AddBookingTeamComponent;
  let fixture: ComponentFixture<AddBookingTeamComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AddBookingTeamComponent]
    });
    fixture = TestBed.createComponent(AddBookingTeamComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
