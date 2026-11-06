package com.mx.Estudiantes.Dao;

import org.springframework.data.jpa.repository.JpaRepository;
import com.mx.Estudiantes.Entidad.Estudiante;

public interface EstudianteDao extends JpaRepository<Estudiante, String> {
}