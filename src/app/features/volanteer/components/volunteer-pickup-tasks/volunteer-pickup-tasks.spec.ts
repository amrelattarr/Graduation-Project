import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VolunteerPickupTasks } from './volunteer-pickup-tasks';

describe('VolunteerPickupTasks', () => {
  let component: VolunteerPickupTasks;
  let fixture: ComponentFixture<VolunteerPickupTasks>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [VolunteerPickupTasks]
    })
    .compileComponents();

    fixture = TestBed.createComponent(VolunteerPickupTasks);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});