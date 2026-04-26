import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PickupTasks } from './pickup-tasks';

describe('PickupTasks', () => {
  let component: PickupTasks;
  let fixture: ComponentFixture<PickupTasks>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PickupTasks]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PickupTasks);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});