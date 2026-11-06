package com.mx.Examen.Dao;

import org.springframework.data.jpa.repository.JpaRepository;

import com.mx.Examen.Entidad.Intento;

public interface IntentoDao	extends JpaRepository<Intento, Integer> {
	
	Intento findByEmailEstudiante(String email);
	boolean existsByEmailEstudiante(String email);
}
