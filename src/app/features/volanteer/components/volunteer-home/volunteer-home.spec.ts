import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VolunteerHome } from './volunteer-home';

describe('VolunteerHome', () => {
  let component: VolunteerHome;
  let fixture: ComponentFixture<VolunteerHome>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [VolunteerHome]
    })
    .compileComponents();

    fixture = TestBed.createComponent(VolunteerHome);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
