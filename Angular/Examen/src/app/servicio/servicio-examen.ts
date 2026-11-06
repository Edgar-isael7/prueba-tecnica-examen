import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { map } from 'rxjs';
import { Intento, Pregunta, Respuesta, RespuestaEnvio } from '../Models/modelos';

@Injectable({
  providedIn: 'root',
})
export class ServicioExamen {
  private http = inject(HttpClient);
  private url = 'http://localhost:9002/examen';

  preguntas() {
    return this.http.get<Pregunta[]>(`${this.url}/preguntas`).pipe(
      map((lista) =>
        [...lista]
          .sort((a, b) => a.orden - b.orden)
          .map((p) => ({ ...p, opciones: [...p.opciones].sort((a, b) => a.id - b.id) })),
      ),
    );
  }

  enviar(email: string, respuestas: RespuestaEnvio[]) {
    return this.http.post<Respuesta<Intento>>(`${this.url}/enviar`, { email, respuestas });
  }

  resultado(email: string) {
    return this.http.get<Intento>(`${this.url}/resultado/${encodeURIComponent(email)}`);
  }
}