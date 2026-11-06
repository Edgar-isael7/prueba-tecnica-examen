package com.mx.Examen.Service;
import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import com.mx.Examen.Dao.IntentoDao;
import com.mx.Examen.Dao.PreguntaDao;
import com.mx.Examen.Dto.EnviarExamenDto;
import com.mx.Examen.Dto.EstudianteDto;
import com.mx.Examen.Dto.OpcionDto;
import com.mx.Examen.Dto.PreguntaDto;
import com.mx.Examen.Dto.RespuestaRequestDto;
import com.mx.Examen.Dto.Respuesta;
import com.mx.Examen.Entidad.Intento;
import com.mx.Examen.Entidad.Opcion;
import com.mx.Examen.Entidad.Pregunta;
import com.mx.Examen.Entidad.RespuestaIntento;

import io.github.resilience4j.circuitbreaker.annotation.CircuitBreaker;
@Service
public class ExamenService {
	private final PreguntaDao preguntaDao;
	private final IntentoDao intentoDao;
	private final RestTemplate restTemplate;

	public ExamenService(PreguntaDao preguntaDao, IntentoDao intentoDao, RestTemplate restTemplate) {
		this.preguntaDao = preguntaDao;
		this.intentoDao = intentoDao;
		this.restTemplate = restTemplate;
	}

	public List<PreguntaDto> obtenerPreguntas() {
		return preguntaDao.findAll().stream()
			.sorted((a, b) -> a.getOrden().compareTo(b.getOrden()))
			.map(p -> new PreguntaDto(
				p.getId(), p.getTexto(), p.getOrden(),
				p.getOpciones().stream()
					.map(o -> new OpcionDto(o.getId(), o.getTexto()))
					.collect(Collectors.toList())
			))
			.collect(Collectors.toList());
	}

	@CircuitBreaker(name = "estudiantes", fallbackMethod = "enviarExamenFallback")
	public ResponseEntity<?> enviarExamen(EnviarExamenDto dto) {
		if (intentoDao.existsByEmailEstudiante(dto.getEmail())) {
			return ResponseEntity.status(409).body(
				new Respuesta("Ya presentaste el examen, no puedes volver a contestarlo", false, obtenerResultado(dto.getEmail()).getBody())
			);
		}

		
		EstudianteDto estudiante = restTemplate.getForObject(
			"http://localhost:9001/estudiantes/validar/" + dto.getEmail(), EstudianteDto.class);

		if (estudiante == null) {
			return ResponseEntity.status(404).body(
				new Respuesta("El correo no corresponde a un estudiante registrado", false, dto.getEmail())
			);
		}

		Intento intento = new Intento();
		intento.setEmailEstudiante(dto.getEmail());
		intento.setFecha(LocalDateTime.now());

		int aciertos = 0;
		List<RespuestaIntento> detalle = new java.util.ArrayList<>();

		for (RespuestaRequestDto r : dto.getRespuestas()) {
			Pregunta pregunta = preguntaDao.findById(r.getPreguntaId()).orElse(null);
			if (pregunta == null) continue;

			boolean esCorrecta = pregunta.getOpciones().stream()
				.filter(Opcion::isEsCorrecta)
				.anyMatch(o -> o.getId().equals(r.getOpcionId()));

			if (esCorrecta) aciertos++;

			RespuestaIntento ri = new RespuestaIntento();
			ri.setIntento(intento);
			ri.setPreguntaId(r.getPreguntaId());
			ri.setOpcionElegidaId(r.getOpcionId());
			ri.setEsCorrecta(esCorrecta);
			detalle.add(ri);
		}

		intento.setAciertos(aciertos);
		intento.setTotal(preguntaDao.findAll().size());
		intento.setRespuestas(detalle);

		intentoDao.save(intento);

		return ResponseEntity.ok(new Respuesta("Examen calificado", true, intento));
	}

	public ResponseEntity<?> enviarExamenFallback(EnviarExamenDto dto, Throwable t) {
		Respuesta rs = new Respuesta("No se pudo validar al estudiante, el servicio no está disponible", false, t.getMessage());
		return ResponseEntity.status(503).body(rs);
	}

	public ResponseEntity<?> obtenerResultado(String email) {
		Intento intento = intentoDao.findByEmailEstudiante(email);
		if (intento == null) {
			return ResponseEntity.status(404).body(
				new Respuesta("Este estudiante aún no ha presentado el examen", false, email)
			);
		}
		return ResponseEntity.ok(intento);
	}
}
