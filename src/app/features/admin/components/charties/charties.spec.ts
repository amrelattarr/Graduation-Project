import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Charties } from './charties';

describe('Charties', () => {
  let component: Charties;
  let fixture: ComponentFixture<Charties>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Charties]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Charties);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
