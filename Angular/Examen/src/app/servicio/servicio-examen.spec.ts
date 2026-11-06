import { TestBed } from '@angular/core/testing';
import { ServicioExamen } from './servicio-examen';

describe('ServicioExamen', () => {
  let service: ServicioExamen;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ServicioExamen);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
