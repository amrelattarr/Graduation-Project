import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CharityAdminHome } from './charity-admin-home';

describe('CharityAdminHome', () => {
  let component: CharityAdminHome;
  let fixture: ComponentFixture<CharityAdminHome>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CharityAdminHome]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CharityAdminHome);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
