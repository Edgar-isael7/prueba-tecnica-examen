import { TestBed } from '@angular/core/testing';
import { CanActivateFn } from '@angular/router';
import { requiereSesionGuard } from './requiere-sesion-guard';

describe('requiereSesionGuard', () => {
  const executeGuard: CanActivateFn = (...guardParameters) =>
    TestBed.runInInjectionContext(() => requiereSesionGuard(...guardParameters));

  beforeEach(() => {
    TestBed.configureTestingModule({});
  });

  it('should be created', () => {
    expect(executeGuard).toBeTruthy();
  });
});
