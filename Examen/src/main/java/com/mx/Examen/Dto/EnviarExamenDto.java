package com.mx.Examen.Dto;

import java.util.List;

import lombok.Data;

@Data
public class EnviarExamenDto {
	private String email;
	
	private List<RespuestaRequestDto> respuestas;
}
