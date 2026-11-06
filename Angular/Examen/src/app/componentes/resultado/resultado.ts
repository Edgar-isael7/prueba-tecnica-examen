import { DatePipe } from '@angular/common';
import { Component, computed, inject, OnInit, signal } from '@angular/core';
import { Router } from '@angular/router';
import { forkJoin } from 'rxjs';
import { Intento, Pregunta } from '../../Models/modelos';
import { ServicioExamen } from '../../servicio/servicio-examen';
import { Sesion } from '../../servicio/sesion';
import { describirError } from '../../Utils/errores';

const RADIO_ANILLO = 54;
const CIRCUNFERENCIA = 2 * Math.PI * RADIO_ANILLO;

@Component({
  selector: 'app-resultado',
  imports: [DatePipe],
  templateUrl: './resultado.html',
  styleUrl: './resultado.css',
})
export class Resultado implements OnInit {
  private router = inject(Router);
  private servicio = inject(ServicioExamen);
  private sesion = inject(Sesion);

  readonly letras = ['A', 'B', 'C', 'D', 'E', 'F'];
  readonly radio = RADIO_ANILLO;

  intento = signal<Intento | null>(null);
  preguntas = signal<Pregunta[]>([]);
  cargando = signal(true);
  errorCarga = signal('');

  porcentaje = computed(() => {
    const i = this.intento();
    return i && i.total > 0 ? Math.round((i.aciertos / i.total) * 100) : 0;
  });

 
  trazo = computed(() => `${(this.porcentaje() / 100) * CIRCUNFERENCIA} ${CIRCUNFERENCIA}`);

 
  filas = computed(() => {
    const intento = this.intento();
    if (!intento) return [];

    return this.preguntas().map((p) => {
      const resp = intento.respuestas.find((r) => r.preguntaId === p.id);
      const indice = p.opciones.findIndex((o) => o.id === resp?.opcionElegidaId);
      return {
        pregunta: p,
        elegida: indice >= 0 ? `${this.letras[indice]}) ${p.opciones[indice].texto}` : 'Sin respuesta',
        correcta: resp?.esCorrecta ?? false,
      };
    });
  });

  ngOnInit() {
    this.cargar();
  }

  cargar() {
    const email = this.sesion.email();
    if (!email) {
      this.router.navigate(['/']);
      return;
    }

    this.cargando.set(true);
    this.errorCarga.set('');

    forkJoin({
      intento: this.servicio.resultado(email),
      preguntas: this.servicio.preguntas(),
    }).subscribe({
      next: ({ intento, preguntas }) => {
        this.intento.set(intento);
        this.preguntas.set(preguntas);
        this.cargando.set(false);
      },
      error: (err) => {
        this.cargando.set(false);
        if (err.status === 404) {
          // Todavía no presenta el examen
          this.router.navigate(['/examen']);
        } else {
          this.errorCarga.set(describirError(err, 'examen'));
        }
      },
    });
  }

  salir() {
    this.sesion.cerrar();
    this.router.navigate(['/']);
  }
}