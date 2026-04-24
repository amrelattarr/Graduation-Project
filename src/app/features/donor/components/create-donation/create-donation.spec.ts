import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateDonation } from './create-donation';

describe('CreateDonation', () => {
  let component: CreateDonation;
  let fixture: ComponentFixture<CreateDonation>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CreateDonation]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CreateDonation);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});