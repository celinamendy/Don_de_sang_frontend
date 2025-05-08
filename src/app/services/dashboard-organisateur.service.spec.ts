import { TestBed } from '@angular/core/testing';

import { DashboardOrganisateurService } from './dashboard-organisateur.service';

describe('DashboardOrganisateurService', () => {
  let service: DashboardOrganisateurService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DashboardOrganisateurService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
