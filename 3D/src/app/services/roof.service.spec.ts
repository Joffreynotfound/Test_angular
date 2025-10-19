import { TestBed } from '@angular/core/testing';

import { RoofService } from './roof.service';

describe('RoofService', () => {
  let service: RoofService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(RoofService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
