import { TestBed } from '@angular/core/testing';

import { Charity } from './charity';

describe('Charity', () => {
  let service: Charity;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(Charity);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
