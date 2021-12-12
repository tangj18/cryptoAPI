import { TestBed } from '@angular/core/testing';

import { CryptodatabaseService } from './cryptodatabase.service';

describe('CryptodatabaseService', () => {
  let service: CryptodatabaseService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CryptodatabaseService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
