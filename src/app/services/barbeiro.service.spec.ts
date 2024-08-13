import { TestBed } from '@angular/core/testing';

import { BarbeiroService } from './barbeiro.service';

describe('BarbeiroService', () => {
  let service: BarbeiroService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(BarbeiroService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
