package com.mx.Examen.Controller;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.mx.Examen.Dto.EnviarExamenDto;
import com.mx.Examen.Service.ExamenService;

@RestController
@RequestMapping("/examen")
public class ExamenController {

	private final ExamenService service;

	public ExamenController(ExamenService service) {
		this.service = service;
	}

	@GetMapping("/preguntas")
	public ResponseEntity<?> preguntas() {
		return ResponseEntity.ok(service.obtenerPreguntas());
	}

	@PostMapping("/enviar")
	public ResponseEntity<?> enviar(@RequestBody EnviarExamenDto dto) {
		return service.enviarExamen(dto);
	}

	@GetMapping("/resultado/{email}")
	public ResponseEntity<?> resultado(@PathVariable String email) {
		return service.obtenerResultado(email);
	}
}
