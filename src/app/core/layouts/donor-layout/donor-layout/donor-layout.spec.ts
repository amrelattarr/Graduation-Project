import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DonorLayout } from './donor-layout';

describe('DonorLayout', () => {
  let component: DonorLayout;
  let fixture: ComponentFixture<DonorLayout>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DonorLayout]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DonorLayout);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
