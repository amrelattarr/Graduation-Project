import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VolanteerLayout } from './volanteer-layout';

describe('VolanteerLayout', () => {
  let component: VolanteerLayout;
  let fixture: ComponentFixture<VolanteerLayout>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [VolanteerLayout]
    })
    .compileComponents();

    fixture = TestBed.createComponent(VolanteerLayout);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
