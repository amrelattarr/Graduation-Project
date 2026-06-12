import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditDonation } from './edit-donation';

describe('EditDonation', () => {
  let component: EditDonation;
  let fixture: ComponentFixture<EditDonation>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EditDonation]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EditDonation);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
