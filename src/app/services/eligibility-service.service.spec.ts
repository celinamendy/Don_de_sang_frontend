import { TestBed } from '@angular/core/testing';

import { EligibilityServiceService } from './eligibility-service.service';

describe('EligibilityServiceService', () => {
  let service: EligibilityServiceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(EligibilityServiceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
