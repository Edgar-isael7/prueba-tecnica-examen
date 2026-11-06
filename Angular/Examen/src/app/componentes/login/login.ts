import { afterNextRender, Component, computed, ElementRef, inject, signal, viewChild } from '@angular/core';
import { Router } from '@angular/router';
import { ServicioEstudiante } from '../../servicio/servicio-estudiante';
import { ServicioExamen } from '../../servicio/servicio-examen';
import { Sesion } from '../../servicio/sesion';
import { describirError } from '../../Utils/errores';


const FORMATO_CORREO = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

@Component({
  selector: 'app-login',
  imports: [],
  templateUrl: './login.html',
  styleUrl: './login.css',
})
export class Login {
  private router = inject(Router);
  private estudiantes = inject(ServicioEstudiante);
  private examen = inject(ServicioExamen);
  private sesion = inject(Sesion);

  private campo = viewChild.required<ElementRef<HTMLInputElement>>('campo');

  correo = signal('');
  tocado = signal(false); 
  intentado = signal(false); 
  cargando = signal(false);
  errorServidor = signal('');

  errorCorreo = computed(() => {
    const valor = this.correo().trim();
    if (!valor) return 'Escribe tu correo para continuar.';
    if (!FORMATO_CORREO.test(valor)) return 'Revisa el formato del correo, por ejemplo nombre@correo.com.';
    return '';
  });

  
  mostrarError = computed(() => (this.tocado() || this.intentado()) && this.errorCorreo() !== '');

  constructor() {
    afterNextRender(() => this.campo().nativeElement.focus());
  }

  entrar(evento: Event) {
    evento.preventDefault();
    this.intentado.set(true);
    this.errorServidor.set('');

    if (this.errorCorreo()) {
      this.campo().nativeElement.focus();
      return;
    }

    const correo = this.correo().trim().toLowerCase();
    this.cargando.set(true);

    
    this.estudiantes.validar(correo).subscribe({
      next: () => this.revisarIntento(correo),
      error: (err) => {
        this.cargando.set(false);
        this.errorServidor.set(
          err.status === 404
            ? 'Ese correo no está registrado como estudiante. Revisa que esté bien escrito.'
            : describirError(err, 'estudiantes'),
        );
      },
    });
  }

  
  private revisarIntento(correo: string) {
    this.examen.resultado(correo).subscribe({
      next: () => {
        this.sesion.iniciar(correo);
        this.router.navigate(['/resultado']);
      },
      error: (err) => {
        if (err.status === 404) {
          this.sesion.iniciar(correo);
          this.router.navigate(['/examen']);
        } else {
          this.cargando.set(false);
          this.errorServidor.set(describirError(err, 'examen'));
        }
      },
    });
  }
}