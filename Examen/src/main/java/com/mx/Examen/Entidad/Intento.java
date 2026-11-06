package com.mx.Examen.Entidad;

import java.time.LocalDateTime;
import java.util.List;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.OneToMany;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Intento {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Integer id;
	
	@Column(unique = true)
	private String emailEstudiante;
	
	private LocalDateTime fecha;
	
	private int aciertos;
	
	private int total;
	
	@OneToMany(mappedBy = "intento", cascade =CascadeType.ALL, fetch = FetchType.EAGER)
	private List<RespuestaIntento> respuestas;
	
}
