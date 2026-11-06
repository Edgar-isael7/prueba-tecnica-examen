\# Examen de Contabilidad – Prueba técnica (Diseñador Programador)



Aplicación web donde un estudiante entra con su correo, contesta un examen de

contabilidad de 5 preguntas y obtiene su calificación (aciertos/total).

Cada estudiante tiene \*\*un solo intento\*\*; si vuelve a entrar, ve su resultado

y las respuestas que dio.



\## Tecnologías

\- \*\*Frontend:\*\* Angular, Bootstrap 5, SweetAlert2

\- \*\*Backend:\*\* Java 17, Spring Boot (microservicios), Spring Cloud Netflix Eureka,

&#x20; Spring Data JPA, Resilience4j (Circuit Breaker), springdoc (Swagger)

\- \*\*Base de datos:\*\* PostgreSQL

\- \*\*IDEs:\*\* Eclipse (backend), VS Code (frontend)



\## Requisitos

| Herramienta | Versión usada |

|---|---|

| Java (JDK) | 17.0.19 (Temurin) |

| Maven | incluido con `mvnw` |

| Node.js | v24.18.0 |

| npm | 12.0.0 |

| Angular CLI | 22.0.6 |

| PostgreSQL | 18 |



\## Estructura del repositorio

```

EurekaServer/    Servidor de descubrimiento (puerto 9000)

Estudiantes/     Microservicio de estudiantes (puerto 9001)

Examen/          Microservicio de examen y calificación (puerto 9002)

Angular/         Frontend (puerto 4200)

Base de Datos/   Scripts SQL

```



\## Instalación y configuración



\### 1. Base de datos

Crear las dos bases vacías (en pgAdmin o con `psql`):

```sql

CREATE DATABASE examen\_estudiantes;

CREATE DATABASE examen\_preguntas;

```

Cargar los scripts de la carpeta `Base de Datos`:

```cmd

psql -U postgres -d examen\_estudiantes -f "Base de Datos/examen\_estudiantes.sql"

psql -U postgres -d examen\_preguntas -f "Base de Datos/examen\_preguntas.sql"

```



\### 2. Credenciales

Los microservicios leen el usuario y la contraseña de PostgreSQL de las variables

de entorno `DB\_USER` y `DB\_PASSWORD` (por defecto `postgres` / `postgres`).

También se pueden editar en el `application.properties` de cada servicio.



\## Cómo ejecutar

Arrancar \*\*en este orden\*\*, cada uno en su terminal:



```cmd

cd EurekaServer

mvnw spring-boot:run



cd Estudiantes

mvnw spring-boot:run



cd Examen

mvnw spring-boot:run



cd Angular

npm install

ng serve

```

(También se pueden iniciar desde Eclipse con \*Run as → Spring Boot App\*.)



Abrir \*\*http://localhost:4200\*\*.



Estudiantes de prueba: `juan.perez@correo.com`, `maria.lopez@correo.com`,

`ana.garcia@correo.com`.



| Servicio | URL |

|---|---|

| Eureka | http://localhost:9000 |

| Estudiantes | http://localhost:9001/swagger-ui/index.html |

| Examen | http://localhost:9002/swagger-ui/index.html |

| Frontend | http://localhost:4200 |



\## Arquitectura

```

Angular (4200) ──► Estudiantes (9001) ──► PostgreSQL: examen\_estudiantes

&#x20;      │

&#x20;      └────────► Examen (9002) ──► PostgreSQL: examen\_preguntas

&#x20;                    │

&#x20;                    └─► valida al estudiante en Estudiantes (RestTemplate + Circuit Breaker)

Todos los servicios se registran en Eureka (9000).

```

\- \*\*Estudiantes:\*\* valida que el correo exista.

\- \*\*Examen:\*\* entrega las preguntas, califica, guarda el intento y devuelve el resultado.

\- \*\*Resilience4j:\*\* si Estudiantes no responde, Examen usa un fallback y no se cae.

\- \*\*Un solo intento:\*\* el servicio rechaza un segundo envío con `409`.



\### Endpoints principales

| Método | Ruta | Descripción |

|---|---|---|

| GET | `/estudiantes/validar/{email}` | Valida el correo |

| GET | `/examen/preguntas` | Preguntas con sus opciones |

| POST | `/examen/enviar` | Envía respuestas y califica |

| GET | `/examen/resultado/{email}` | Resultado e intento guardado |



\## Dudas, supuestos y lo que se dejó fuera

\- Se asume que los estudiantes están precargados (no hay registro).

\- El acceso es solo por correo, sin contraseña, como pedía la prueba.







\## Con más tiempo

\- Docker Compose para levantar todo con un comando.

\- Autenticación real (JWT) y roles.

\- Pruebas automáticas del backend y del frontend.

\- Integración LTI.

\- Cronómetro y orden aleatorio de las preguntas.

