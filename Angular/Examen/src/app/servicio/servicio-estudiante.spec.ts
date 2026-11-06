import { TestBed } from '@angular/core/testing';
import { ServicioEstudiante } from './servicio-estudiante';

describe('ServicioEstudiante', () => {
  let service: ServicioEstudiante;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ServicioEstudiante);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
