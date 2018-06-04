import { TestBed, inject } from '@angular/core/testing';

import { CollapsibleService } from './collapsible.service';

describe('CollapsibleService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [CollapsibleService]
    });
  });

  it('should be created', inject([CollapsibleService], (service: CollapsibleService) => {
    expect(service).toBeTruthy();
  }));
});
