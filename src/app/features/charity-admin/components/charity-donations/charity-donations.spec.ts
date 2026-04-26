import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CharityDonations } from './charity-donations';

describe('CharityDonations', () => {
  let component: CharityDonations;
  let fixture: ComponentFixture<CharityDonations>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CharityDonations]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CharityDonations);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});