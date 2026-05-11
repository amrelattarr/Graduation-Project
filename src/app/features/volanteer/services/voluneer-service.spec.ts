import { TestBed } from '@angular/core/testing';

import { VoluneerService } from './voluneer-service';

describe('VoluneerService', () => {
  let service: VoluneerService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(VoluneerService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
