package com.mx.Examen.Config;

import java.util.List;

import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import com.mx.Examen.Dao.PreguntaDao;
import com.mx.Examen.Entidad.Opcion;
import com.mx.Examen.Entidad.Pregunta;

@Component
public class DataLoader implements CommandLineRunner {
	private final PreguntaDao preguntaDao;

	public DataLoader(PreguntaDao preguntaDao) {
		this.preguntaDao = preguntaDao;
	}

	@Override
	public void run(String... args) {
		if (preguntaDao.count() > 0) return;

		crear("El saldo inicial de Bancos es de $850,000.", 1,
			op("Cargo", true), op("Abono", false), op("No se registra", false), op("Se registra en ambas columnas", false));

		crear("Se pagó al proveedor INMOBILIARIA SA la cantidad de $17,700.", 2,
			op("Cargo", false), op("Abono", true), op("No se registra", false), op("Se registra en ambas columnas", false));

		crear("Se vendió una máquina envasadora y se cobró la cantidad de $120,000.", 3,
			op("Cargo", true), op("Abono", false), op("No se registra", false), op("Se registra en ambas columnas", false));

		crear("Se entregaron viáticos por viaje a Monterrey al vendedor Javier Barrera por $70,000.", 4,
			op("Cargo", false), op("Abono", true), op("No se registra", false), op("Se registra en ambas columnas", false));

		crear("El cliente ZAZA SA pagó por un servicio la cantidad de $25,000.", 5,
			op("Cargo", true), op("Abono", false), op("No se registra", false), op("Se registra en ambas columnas", false));
	}

	private Opcion op(String texto, boolean correcta) {
		Opcion o = new Opcion();
		o.setTexto(texto);
		o.setEsCorrecta(correcta);
		return o;
	}

	private void crear(String texto, int orden, Opcion... opciones) {
		Pregunta p = new Pregunta();
		p.setTexto(texto);
		p.setOrden(orden);
		for (Opcion o : opciones) {
			o.setPregunta(p);
		}
		p.setOpciones(List.of(opciones));
		preguntaDao.save(p);
	}

}
