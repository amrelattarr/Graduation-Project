import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DonorHome } from './donor-home';

describe('DonorHome', () => {
  let component: DonorHome;
  let fixture: ComponentFixture<DonorHome>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DonorHome]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DonorHome);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
