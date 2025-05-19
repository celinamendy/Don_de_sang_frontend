import { TestBed } from '@angular/core/testing';

import { GroupeSanguinService } from './groupe-sanguin.service';

describe('GroupeSanguinService', () => {
  let service: GroupeSanguinService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(GroupeSanguinService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
