import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MyVolunteers } from './my-volunteers';

describe('MyVolunteers', () => {
  let component: MyVolunteers;
  let fixture: ComponentFixture<MyVolunteers>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MyVolunteers]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MyVolunteers);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
