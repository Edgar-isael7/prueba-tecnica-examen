package com.mx.Estudiantes.Config;

import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import com.mx.Estudiantes.Dao.EstudianteDao;
import com.mx.Estudiantes.Entidad.Estudiante;
@Component
public class DataLoader implements CommandLineRunner {
    private final EstudianteDao estudianteDao;

    public DataLoader(EstudianteDao estudianteDao) {
        this.estudianteDao = estudianteDao;
    }

    @Override
    public void run(String... args) {
        guardarSiNoExiste("juan.perez@correo.com", "Juan Perez");
        guardarSiNoExiste("maria.lopez@correo.com", "Maria Lopez");
        guardarSiNoExiste("ana.garcia@correo.com", "Ana Garcia");
        guardarSiNoExiste("edi.velazquez@correo.com", "Ediberto Velazquez");
    }

    private void guardarSiNoExiste(String email, String nombre) {
        if (!estudianteDao.existsById(email)) {
            estudianteDao.save(new Estudiante(email, nombre));
        }
    }
}
