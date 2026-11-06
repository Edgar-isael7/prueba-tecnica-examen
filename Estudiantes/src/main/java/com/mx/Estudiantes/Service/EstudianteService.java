package com.mx.Estudiantes.Service;

import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import com.mx.Estudiantes.Dao.EstudianteDao;
import com.mx.Estudiantes.Dto.Respuesta;
import com.mx.Estudiantes.Entidad.Estudiante;

@Service
public class EstudianteService {
	private final EstudianteDao estudianteDao; 

	public EstudianteService(EstudianteDao estudianteDao) {
		this.estudianteDao = estudianteDao;
	}

	public ResponseEntity<?> validar(String email) {
		Estudiante estudiante = estudianteDao.findById(email).orElse(null);
		if (estudiante == null) {
			Respuesta rs = new Respuesta("El correo no corresponde a un estudiante registrado", false, null);
			return ResponseEntity.status(404).body(rs);
		}
		return ResponseEntity.ok(estudiante);
	}
}
