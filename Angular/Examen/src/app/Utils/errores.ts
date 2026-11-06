import { HttpErrorResponse } from '@angular/common/http';


export function describirError(err: unknown, servicio: string): string {
  console.error(`Error en el servicio de ${servicio}:`, err);

  const status = err instanceof HttpErrorResponse ? err.status : -1;

  if (status === 0) {
    return `No hay conexión con el servicio de ${servicio}. Reportalo con el area de TI e inténtalo mas tarde.`;
  }
  if (status === 503) {
    return `El servicio de ${servicio} no está disponible por el momento. Espera unos segundos e inténtalo de nuevo.`;
  }
  return `Ocurrió un error inesperado con el servicio de ${servicio}. Inténtalo de nuevo.`;
}