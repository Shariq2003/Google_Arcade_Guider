import { TestBed } from '@angular/core/testing';

import { FileHelper } from './file-helper';

describe('FileHelper', () => {
  let service: FileHelper;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(FileHelper);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
