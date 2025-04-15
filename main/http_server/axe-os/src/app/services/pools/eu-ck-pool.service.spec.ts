import { TestBed } from '@angular/core/testing';

import { EuCkPoolService } from './eu-ck-pool.service';

describe('EuCkPoolService', () => {
  let service: EuCkPoolService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(EuCkPoolService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
