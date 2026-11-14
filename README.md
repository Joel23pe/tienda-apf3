# Tienda – API REST con Spring Data JPA, JWT y front-end Angular

Avance de Proyecto Final 3 (APF3) – Curso Integrador II: Sistemas.

Back-end de una tienda (productos, categorías, ventas y usuarios) con persistencia en **Spring Data JPA / Hibernate** sobre **PostgreSQL**, consultas **JPQL**, transacciones con `@Transactional`, seguridad con **Spring Security + JWT** y documentación con **Swagger / OpenAPI**. Incluye un front-end en **Angular** (carpeta `frontend`).

## Tecnologías

Java 21 · Spring Boot 4.1.1 · Spring Data JPA (Hibernate 7) · PostgreSQL · Spring Security · jjwt 0.12.6 · springdoc-openapi 3.0.1 · Maven · Angular · SASS

## Estructura de paquetes (`com.apf2.tienda`)

| Paquete      | Contenido                                                              |
| ------------ | ---------------------------------------------------------------------- |
| `model`      | Entidades JPA: `Categoria`, `Producto`, `Venta`, `DetalleVenta`, `Usuario`, `Rol` |
| `repository` | Interfaces `JpaRepository` y consultas JPQL (`ProductoRepository`)     |
| `service`    | Lógica de negocio; `VentaService` usa `@Transactional`                 |
| `controller` | Endpoints REST                                                         |
| `security`   | `SecurityConfig`, `JwtUtil`, `JwtAuthFilter`, `UserDetailsServiceImpl` |
| `exception`  | Manejo global de errores                                               |
| `config`     | `DataInitializer` (datos de prueba) y `OpenApiConfig` (Swagger)        |

## Cómo ejecutar el back-end

Requisitos: Java 21 y **PostgreSQL** en ejecución con la base de datos `tienda` creada.

1. Clonar el repositorio: `git clone https://github.com/Joel23pe/tienda-apf3.git`
2. Configurar la conexión a PostgreSQL. Los valores (URL, usuario, contraseña y clave JWT) se leen de variables de entorno, según `src/main/resources/application-prod.properties`. La clave JWT debe ser Base64 (mínimo 256 bits). Para generar una en PowerShell:

   ```
   [Convert]::ToBase64String((1..48 | ForEach-Object { Get-Random -Maximum 256 }))
   ```

3. Definir las variables en la misma terminal donde se ejecuta Maven y arrancar con el perfil `prod`:

   ```
   .\mvnw.cmd spring-boot:run -Dspring-boot.run.profiles=prod
   ```

   Debe aparecer `Started TiendaApplication` en la consola.

4. Documentación interactiva (Swagger UI): http://localhost:8080/swagger-ui.html

## Usuarios de prueba

| Usuario | Contraseña | Rol                              |
| ------- | ---------- | -------------------------------- |
| `admin` | `admin123` | `ROLE_ADMIN` (puede usar DELETE) |
| `user`  | `user123`  | `ROLE_USER`                      |

## Endpoints

| Método     | Ruta                                | Acceso                    |
| ---------- | ----------------------------------- | ------------------------- |
| POST       | `/api/auth/login`                   | Público                   |
| POST       | `/api/auth/register`                | Público                   |
| GET / POST | `/api/productos`                    | Token JWT                 |
| GET / PUT  | `/api/productos/{id}`               | Token JWT                 |
| DELETE     | `/api/productos/{id}`               | Solo ADMIN                |
| GET        | `/api/productos/buscar?texto=`      | Token JWT (JPQL)          |
| GET        | `/api/productos/categoria/{id}`     | Token JWT (JPQL)          |
| GET        | `/api/productos/stock-bajo?minimo=` | Token JWT (JPQL)          |
| GET        | `/api/productos/valor-inventario`   | Token JWT (JPQL)          |
| GET / POST | `/api/categorias`                   | Token JWT                 |
| POST / GET | `/api/ventas`                       | Token JWT (transaccional) |

Sin token la API responde `401`; con token pero sin permiso, `403`.

## Pruebas con Postman

Importar `postman/Tienda-APF2.postman_collection.json`. Ejecutar primero **1. Auth → Login admin**: guarda el token automáticamente en la variable `token`. El token dura 1 hora y deja de ser válido si se cambia la clave JWT; en ese caso hay que iniciar sesión otra vez. Los datos se guardan en PostgreSQL y se conservan al reiniciar la aplicación.

## Front-end Angular (carpeta `frontend`)

Cliente web en Angular con SASS que consume la API REST y autentica con JWT.

| Carpeta             | Contenido                                                          |
| ------------------- | ------------------------------------------------------------------ |
| `core/models`       | Interfaces `Producto`, `LoginRequest`, `LoginResponse`             |
| `core/services`     | `AuthService` (login/logout/token) y `ProductoService` (CRUD REST) |
| `core/interceptors` | `jwtInterceptor` (agrega Bearer) y `errorInterceptor` (errores)    |
| `core/guards`       | `authGuard` (protege rutas)                                        |
| `features/login`    | Formulario reactivo de login con validación                        |
| `features/productos`| Lista y formulario de crear/editar con validación                  |
| `styles`            | `_variables.scss` (variables y mixin SASS)                         |

Rutas: `/login`, `/productos`, `/productos/nuevo`, `/productos/:id/editar` (protegidas con guard).

### Ejecutar el front-end

1. Back-end en ejecución (PostgreSQL encendido y aplicación arrancada como se indica arriba).
2. Front-end: `cd frontend`, luego `npm install` y `ng serve --proxy-config proxy.conf.json`
3. Abrir http://localhost:4200 (usuario `admin`, contraseña `admin123`).