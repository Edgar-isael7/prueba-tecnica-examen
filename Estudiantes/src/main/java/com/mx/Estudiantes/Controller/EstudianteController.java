package com.mx.Estudiantes.Controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.mx.Estudiantes.Service.EstudianteService;

@RestController
@RequestMapping("/estudiantes")
public class EstudianteController {
	private final EstudianteService service;

	public EstudianteController(EstudianteService service) {
		this.service = service;
	}

	@GetMapping("/validar/{email}")
	public ResponseEntity<?> validar(@PathVariable String email) {
		return service.validar(email);
	}
}
