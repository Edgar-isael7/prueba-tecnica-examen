package com.mx.Estudiantes.Dto;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class Respuesta {

	private String mensaje; 
	
	private boolean estado;
	
	private Object contenido;
}