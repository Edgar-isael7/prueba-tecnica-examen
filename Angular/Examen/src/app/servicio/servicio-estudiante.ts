import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Estudiante } from '../Models/modelos';

@Injectable({
  providedIn: 'root',
})
export class ServicioEstudiante {
  private http = inject(HttpClient);
  private url = 'http://localhost:9001/estudiantes';

  validar(email: string) {
    return this.http.get<Estudiante>(`${this.url}/validar/${encodeURIComponent(email)}`);
  }
}