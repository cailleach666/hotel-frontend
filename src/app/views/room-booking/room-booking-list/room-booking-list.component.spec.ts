import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RoomBookingListComponent } from './room-booking-list.component';

describe('RoomBookingListComponent', () => {
  let component: RoomBookingListComponent;
  let fixture: ComponentFixture<RoomBookingListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RoomBookingListComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RoomBookingListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
