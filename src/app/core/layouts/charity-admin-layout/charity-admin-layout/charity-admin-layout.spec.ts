import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CharityAdminLayout } from './charity-admin-layout';

describe('CharityAdminLayout', () => {
  let component: CharityAdminLayout;
  let fixture: ComponentFixture<CharityAdminLayout>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CharityAdminLayout]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CharityAdminLayout);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
