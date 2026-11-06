import { Component, inject } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { NavigationEnd, Router, RouterOutlet } from '@angular/router';
import { filter } from 'rxjs';
import Swal from 'sweetalert2';
import { Sesion } from './servicio/sesion';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet],
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App {
  private router = inject(Router);
  protected sesion = inject(Sesion);

  constructor() {
  
    this.router.events
      .pipe(
        filter((e): e is NavigationEnd => e instanceof NavigationEnd),
        takeUntilDestroyed(),
      )
      .subscribe((e) => {
        if (e.urlAfterRedirects !== '/') {
          document.getElementById('contenido')?.focus({ preventScroll: true });
        }
      });
  }

  irAlContenido(evento: Event) {
    evento.preventDefault();
    document.getElementById('contenido')?.focus();
  }

  async salir() {
    if (this.sesion.sinEnviar()) {
      const r = await Swal.fire({
        title: '¿Salir del examen?',
        text: 'Perderás las respuestas que no hayas enviado.',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Sí, salir',
        cancelButtonText: 'Seguir contestando',
        confirmButtonColor: '#b42318',
        reverseButtons: true,
        focusCancel: true,
      });
      if (!r.isConfirmed) return;
    }
    this.sesion.cerrar();
    this.router.navigate(['/']);
  }
}