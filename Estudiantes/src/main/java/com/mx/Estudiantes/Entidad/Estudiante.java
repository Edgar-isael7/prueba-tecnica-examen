package com.mx.Estudiantes.Entidad;

import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "Estudiante")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Estudiante {

	
	@Id
	private String email;
	
	private String nombre;
}
