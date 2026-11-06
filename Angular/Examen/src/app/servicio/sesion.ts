import { Injectable, signal } from '@angular/core';

const CLAVE = 'examen.email';

@Injectable({
  providedIn: 'root',
})
export class Sesion {
  readonly email = signal<string | null>(this.leer());

  readonly sinEnviar = signal(false);

  iniciar(email: string) {
    this.email.set(email);
    this.guardar(email);
  }

  cerrar() {
    this.email.set(null);
    this.sinEnviar.set(false);
    this.guardar(null);
  }

  private leer(): string | null {
    try {
      return sessionStorage.getItem(CLAVE);
    } catch {
      return null;
    }
  }

  private guardar(valor: string | null) {
    try {
      if (valor) sessionStorage.setItem(CLAVE, valor);
      else sessionStorage.removeItem(CLAVE);
    } catch {
    }
  }
}