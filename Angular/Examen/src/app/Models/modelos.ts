export interface Estudiante {
  email: string;
  nombre: string;
}

export interface Opcion {
  id: number;
  texto: string;
}

export interface Pregunta {
  id: number;
  texto: string;
  orden: number;
  opciones: Opcion[];
}

export interface RespuestaEnvio {
  preguntaId: number;
  opcionId: number;
}

export interface RespuestaIntento {
  preguntaId: number;
  opcionElegidaId: number;
  esCorrecta: boolean;
}

export interface Intento {
  id: number;
  emailEstudiante: string;
  fecha: string;
  aciertos: number;
  total: number;
  respuestas: RespuestaIntento[];
}

export interface Respuesta<T = unknown> {
  mensaje: string;
  estado: boolean;
  contenido: T;
}