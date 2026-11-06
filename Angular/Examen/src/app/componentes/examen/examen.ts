import { Component, computed, HostListener, inject, OnDestroy, OnInit, signal } from '@angular/core';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';
import { Pregunta } from '../../Models/modelos';
import { ServicioExamen } from '../../servicio/servicio-examen';
import { Sesion } from '../../servicio/sesion';
import { describirError } from '../../Utils/errores';

@Component({
  selector: 'app-examen',
  imports: [],
  templateUrl: './examen.html',
  styleUrl: './examen.css',
})
export class Examen implements OnInit, OnDestroy {
  private router = inject(Router);
  private servicio = inject(ServicioExamen);
  private sesion = inject(Sesion);

  readonly letras = ['A', 'B', 'C', 'D', 'E', 'F'];

  preguntas = signal<Pregunta[]>([]);
  // preguntaId -> opcionId elegida
  seleccion = signal<Record<number, number>>({});
  cargando = signal(true);
  errorCarga = signal('');
  enviando = signal(false);
  intentado = signal(false); 

  total = computed(() => this.preguntas().length);
  contestadas = computed(() => Object.keys(this.seleccion()).length);
  porcentaje = computed(() => (this.total() ? Math.round((this.contestadas() / this.total()) * 100) : 0));
  faltantes = computed(() => this.preguntas().filter((p) => this.seleccion()[p.id] === undefined));

  ngOnInit() {
    this.cargar();
  }

  ngOnDestroy() {
    this.sesion.sinEnviar.set(false);
  }

  
  @HostListener('window:beforeunload', ['$event'])
  avisarAntesDeSalir(evento: BeforeUnloadEvent) {
    if (this.sesion.sinEnviar()) evento.preventDefault();
  }

  cargar() {
    this.cargando.set(true);
    this.errorCarga.set('');

    this.servicio.preguntas().subscribe({
      next: (lista) => {
        this.preguntas.set(lista);
        this.cargando.set(false);
      },
      error: (err) => {
        this.cargando.set(false);
        this.errorCarga.set(describirError(err, 'examen'));
      },
    });
  }

  elegir(preguntaId: number, opcionId: number) {
    this.seleccion.update((s) => ({ ...s, [preguntaId]: opcionId }));
    this.sesion.sinEnviar.set(true);
  }

  async enviar() {
    const email = this.sesion.email();
    if (!email || this.enviando()) return;

    this.intentado.set(true);

    
    const faltan = this.faltantes();
    if (faltan.length > 0) {
      this.irAPregunta(faltan[0].id);
      return;
    }

    
    const confirmacion = await Swal.fire({
      title: '¿Enviar el examen?',
      text: 'Solo tienes un intento. Después de enviarlo no podrás cambiar tus respuestas.',
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Sí, enviar',
      cancelButtonText: 'Revisar',
      confirmButtonColor: '#1f3a5f',
      reverseButtons: true,
      focusCancel: true,
    });
    if (!confirmacion.isConfirmed) return;

    const respuestas = this.preguntas().map((p) => ({
      preguntaId: p.id,
      opcionId: this.seleccion()[p.id],
    }));

    this.enviando.set(true);
    this.servicio.enviar(email, respuestas).subscribe({
      next: (resp) => {
        const intento = resp.contenido;
        this.sesion.sinEnviar.set(false);
        Swal.fire({
          title: 'Examen enviado',
          text: `Obtuviste ${intento.aciertos} aciertos de ${intento.total} (${intento.aciertos}/${intento.total}).`,
          icon: 'success',
          confirmButtonText: 'Ver mis respuestas',
          confirmButtonColor: '#1f3a5f',
        }).then(() => this.router.navigate(['/resultado']));
      },
      error: (err) => {
        this.enviando.set(false);
        if (err.status === 409) {
         
          this.sesion.sinEnviar.set(false);
          Swal.fire({
            title: 'Examen ya presentado',
            text: 'Ya habías enviado este examen. Te mostramos tu resultado.',
            icon: 'info',
            confirmButtonColor: '#1f3a5f',
          }).then(() => this.router.navigate(['/resultado']));
        } else {
          Swal.fire({
            title: 'No se pudo enviar',
            text: describirError(err, 'examen') + ' Tus respuestas siguen aquí.',
            icon: 'error',
            confirmButtonColor: '#1f3a5f',
          });
        }
      },
    });
  }

  private irAPregunta(preguntaId: number) {
    const bloque = document.getElementById(`pregunta-${preguntaId}`);
    if (!bloque) return;
    const reducir = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    bloque.scrollIntoView({ behavior: reducir ? 'auto' : 'smooth', block: 'center' });
    bloque.querySelector<HTMLInputElement>('input[type="radio"]')?.focus({ preventScroll: true });
  }
}