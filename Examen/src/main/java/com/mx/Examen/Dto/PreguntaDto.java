package com.mx.Examen.Dto;

import java.util.List;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class PreguntaDto {
	private Integer id;
	
	private String texto;
	
	private Integer orden;
	
	private List<OpcionDto> opciones;
}
