import { Routes } from '@angular/router';
import { Login } from './componentes/login/login';
import { Examen } from './componentes/examen/examen';
import { Resultado } from './componentes/resultado/resultado';
import { requiereSesion } from './guards/requiere-sesion';

export const routes: Routes = [
  { path: '', component: Login, title: 'Entrar · Evaluación' },
  { path: 'examen', component: Examen, canActivate: [requiereSesion], title: 'Examen de contabilidad · Evaluación' },
  { path: 'resultado', component: Resultado, canActivate: [requiereSesion], title: 'Mi resultado · Evaluación' },
  { path: '**', redirectTo: '' },
];
