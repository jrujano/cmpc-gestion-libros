# 📚 CMPCLibros - Sistema de Gestión de Libros

Proyecto fullstack para la gestión de libros, desarrollado con **NestJS**, **React**, **TypeScript**, **Sequelize**, **PostgreSQL** y contenedores **Docker**.

---

## 🧱 Tecnologías Utilizadas

### 🔹 Backend

- [NestJS](https://nestjs.com/)
- TypeScript
- Sequelize ORM
- PostgreSQL
- JWT para autenticación
- Docker

### 🔹 Frontend

- [React](https://reactjs.org/)
- React Router v6
- Tailwind CSS
- Axios
- Context API para autenticación
- Vite

---

## 📂 Estructura del Proyecto Backend

```bash
.
├── backend
│   ├── Dockerfile
│   ├── eslint.config.mjs
│   ├── logger.config.ts
│   ├── nest-cli.json
│   ├── package.json
│   ├── package-lock.json
│   ├── README.md
│   ├── src
│   │   ├── app.controller.spec.ts
│   │   ├── app.controller.ts
│   │   ├── app.module.ts
│   │   ├── app.service.ts
│   │   ├── core  # Utilidades centrales
│   │   │   ├── decorators
│   │   │   │   ├── public.decorator.ts
│   │   │   │   └── roles.decorator.ts
│   │   │   ├── exceptions
│   │   │   ├── guards
│   │   │   │   ├── jwt-auth.guard.ts
│   │   │   │   ├── local-auth.guard.ts
│   │   │   │   ├── refresh-jwt.guard.ts
│   │   │   │   └── roles.guard.ts
│   │   │   ├── interceptor
│   │   │   │   └── audit.interceptor.ts
│   │   │   └── interfaces
│   │   │       ├── request-with-user.interface.ts
│   │   │       └── user-payload.interface.ts
│   │   ├── main.ts # Punto de entrada
│   │   └── modules  # Módulos funcionales
│   │       ├── auth
│   │       │   ├── auth.controller.ts
│   │       │   ├── auth.module.ts
│   │       │   ├── auth.service.ts
│   │       │   ├── dto
│   │       │   │   ├── auth-response.dto.ts
│   │       │   │   ├── token-response.dto.ts
│   │       │   │   └── user-response.dto.ts
│   │       │   └── strategies
│   │       │       ├── jwt.strategy.ts
│   │       │       ├── local.strategy.ts
│   │       │       └── refresh-jwt.strategy.ts
│   │       ├── authors
│   │       │   ├── authors.controller.ts
│   │       │   ├── authors.module.ts
│   │       │   ├── authors.service.ts
│   │       │   ├── dto
│   │       │   │   ├── create-author.dto.ts
│   │       │   │   └── update-author.dto.ts
│   │       │   └── models
│   │       │       └── author.model.ts
│   │       ├── books
│   │       │   ├── books.controller.ts
│   │       │   ├── books.module.ts
│   │       │   ├── books.service.ts
│   │       │   ├── dto
│   │       │   │   ├── create-book.dto.ts
│   │       │   │   └── update-book.dto.ts
│   │       │   └── models
│   │       │       ├── book-author.model.ts
│   │       │       └── book.model.ts
│   │       ├── customers
│   │       │   ├── customer.controller.ts
│   │       │   ├── customer.module.ts
│   │       │   ├── customer.service.ts
│   │       │   ├── dto
│   │       │   │   ├── create-customer.dto.ts
│   │       │   │   ├── customer-response.dto.ts
│   │       │   │   └── update-customer.dto.ts
│   │       │   └── models
│   │       │       └── customers.model.ts
│   │       ├── editorials
│   │       │   ├── dto
│   │       │   │   ├── create-editorial.dto.ts
│   │       │   │   └── update-editorial.dto.ts
│   │       │   ├── editorials.controller.ts
│   │       │   ├── editorials.module.ts
│   │       │   ├── editorials.service.ts
│   │       │   └── models
│   │       │       └── editorial.model.ts
│   │       ├── genres
│   │       │   ├── dto
│   │       │   │   ├── create-genre.dto.ts
│   │       │   │   └── update-genre.dto.ts
│   │       │   ├── genres.controller.ts
│   │       │   ├── genres.module.ts
│   │       │   ├── genres.service.ts
│   │       │   └── models
│   │       │       └── genre.model.ts
│   │       ├── inventory
│   │       │   ├── constants
│   │       │   │   └── inventory.constants.ts
│   │       │   ├── dto
│   │       │   │   ├── create-inventory.dto.ts
│   │       │   │   ├── inventory-filter.dto.ts
│   │       │   │   ├── inventory-report.dto.ts
│   │       │   │   ├── inventory-response.dto.ts
│   │       │   │   └── update-inventory.dto.ts
│   │       │   ├── interfaces
│   │       │   │   └── inventory.interface.ts
│   │       │   ├── inventory.controller.ts
│   │       │   ├── inventory.module.ts
│   │       │   ├── inventory.service.ts
│   │       │   └── models
│   │       │       └── inventory.model.ts
│   │       ├── shared
│   │       │   └── database
│   │       │       ├── database.module.ts
│   │       │       ├── database.service.ts
│   │       │       ├── models
│   │       │       └── seeders
│   │       │           ├── author.seeder.ts
│   │       │           ├── book-author.seeder.ts
│   │       │           ├── book.seeder.ts
│   │       │           ├── customer.seeder.ts
│   │       │           ├── editorial.seeder.ts
│   │       │           ├── genre.seeder.ts
│   │       │           └── index.ts
│   │       └── users
│   │           ├── dto
│   │           │   ├── create-user.dto.ts
│   │           │   ├── login-user.dto.ts
│   │           │   ├── update-user.dto.ts
│   │           │   └── user-response.dto.ts
│   │           ├── models
│   │           │   ├── user.model.ts
│   │           │   └── user-role.enum.ts
│   │           ├── users.controller.ts
│   │           ├── users.module.ts
│   │           └── users.service.ts
│   ├── test
│   │   ├── app.e2e-spec.ts
│   │   └── jest-e2e.json
│   ├── tsconfig.build.json
│   └── tsconfig.json


```

## 🔧 Configuración Inicial

### Requisitos previos

- Docker y Docker Compose instalados
- Node.js (v16+)

### Iniciar el proyecto

```bash
docker-compose up --build
```

Los servicios estarán disponibles en:

Backend: http://localhost:3000

Frontend: http://localhost:5173

PostgreSQL: puerto 5432

## 📊 Documentación API con Swagger

La documentación de la API está disponible en:

```bash
http://localhost:3000/api
```

---

## Backend - Características Técnicas

### 🌐 Endpoints Clave (Backend)

#### Autenticación

Método Endpoint Descripción

POST /auth/login Inicio de sesión

POST /auth/register Registro de usuario

POST /auth/refresh-token Refrescar token

#### Libros

Método Endpoint Descripción

GET /books Listado paginado con filtros

POST /books Crear nuevo libro

GET /books/export Exportar a CSV

GET /books/:id Detalles de libro

## 🛡️ Sistema de Autenticación

```bash
// Ejemplo de uso
@Controller('books')
@UseGuards(JwtAuthGuard, RolesGuard)
export class BooksController {
  @Post()
  @Roles(UserRole.ADMIN)
  async create(@Body() createBookDto: CreateBookDto) {
    // ...
  }
}
```

JwtAuthGuard: Verifica validez del token JWT

RolesGuard: Controla acceso basado en roles (Admin/User)

Public Decorator: Para rutas públicas

```bash
@Public()
@Get('public-route')
async publicData() { /* ... */ }
```

## CRUD de Libros con Características Avanzadas

El módulo de libros (/backend/src/modules/books/) incluye:

### Paginación y filtrado:

Endpoint: GET /books?page=0&limit=100&search=valor a buscar

### Implementación en books.service.ts usando findAndCountAll de Sequelize

Exportación a CSV:

Endpoint: GET /books/export

Genera un archivo CSV con todos los libros

### 🗃️ Base de Datos

![Selección_512](https://github.com/user-attachments/assets/73d44d1e-bc3e-4448-96eb-a1a371e486ce)

```bash
SequelizeModule.forRootAsync({
  dialect: 'postgres',
  host: configService.get('DB_HOST'),
  port: +configService.get('DB_PORT'),
  username: configService.get('DB_USER'),
  password: configService.get('DB_PASS'),
  database: configService.get('DB_NAME'),
  autoLoadModels: true,
  synchronize: true,
  define: {
    timestamps: true,
    underscored: true,
    paranoid: true // Soft delete
  }
})
```

### 🗑️ Sistema de Soft Delete

El proyecto implementa eliminación lógica (soft delete) para mantener la integridad referencial y permitir recuperación de datos.

Configuración en los modelos
Ejemplo en book.model.ts:

```
@DefaultScope(() => ({
  where: { deletedAt: null }, // Filtra automáticamente los eliminados
}))
@Scopes(() => ({
  withDeleted: { where: {} }, // Incluye registros eliminados
  deleted: { where: { deletedAt: { [Op.ne]: null } } }, // Solo eliminados
}))
@Table({
  tableName: 'books',
  paranoid: true, // Habilita soft delete
  timestamps: true,
})
export class Book extends Model {
  // ...otros campos

  @Column
  deletedAt: Date; // Campo para marca temporal de eliminación
}
```

#### 📚 Seeders: Poblado Inicial de la Base de Datos

¿Qué son los Seeders?
Los seeders son scripts que insertan datos iniciales en la base de datos. Son útiles para:

Poblar la base con datos de prueba durante el desarrollo

Crear datos maestros esenciales (ej: roles, categorías básicas)

Garantizar un entorno consistente para todos los desarrolladores

Preparar datos demo para presentaciones o pruebas

#### Ubicación: backend/src/modules/shared/database/seeders/

Ejemplo (author.seeder.ts):

```bash
export default {
  up: async (queryInterface: QueryInterface) => {
    await queryInterface.bulkInsert('authors', [
      {
        name: 'Gabriel García Márquez',
        biography: 'Escritor colombiano...',
        created_at: new Date(),
        updated_at: new Date()
      }
    ]);
  },
  down: async (queryInterface: QueryInterface) => {
    await queryInterface.bulkDelete('authors', null, {});
  }
}
```

## Seeders Disponibles

Archivo Descripción Datos Incluidos

author.seeder.ts Autores literarios famosos 20+ autores con biografías

book.seeder.ts Libros clásicos y contemporáneos 50+ libros con relaciones

genre.seeder.ts Géneros literarios 10 géneros principales

editorial.seeder.ts Editoriales reconocidas 15+ editoriales internacionales

user.seeder.ts Usuarios demo Admin + usuarios regulares

### Ejecución de Seeders

```bash
// En database.service.ts
async seedInitialData() {
  await seedGenres(this.sequelize);
  await seedAuthors(this.sequelize);
  // ...otros seeders
}
```

#### 🔄 Transacciones en Sequelize

Ejemplo en servicio:

```bash
async createWithAuthors(createDto: CreateBookDto) {
  return this.sequelize.transaction(async (t) => {
    const book = await this.bookModel.create({
      title: createDto.title,
      // ...otros campos
    }, { transaction: t });

    await this.bookAuthorModel.bulkCreate(
      createDto.authors.map(authorId => ({
        book_id: book.id,
        author_id: authorId
      })),
      { transaction: t }
    );

    return book;
  });
}

```

### 📝 Sistema de Logs y Auditoría

El backend implementa un sistema completo de logging con:

#### 1. Logger Global (Interceptor)

```bash
// audit.interceptor.ts
@Injectable()
export class AuditInterceptor implements NestInterceptor {
  private readonly logger = new Logger('Audit');

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest();
    this.logger.log(`Request: ${request.method} ${request.url}`);

    return next.handle().pipe(
      tap(() => this.logger.log(`Response: ${request.method} ${request.url}`))
    );
  }
}
```

##### Ejemplo de log:

```bash
[Audit] Request: POST /books
[Audit] Response: POST /books (201)
```

#### 2. Loggers Específicos por Servicio

```bash
// books.service.ts
export class BooksService {
  private readonly logger = new Logger(BooksService.name);

  async createBook(dto: CreateBookDto) {
    this.logger.log(`Creando libro: ${dto.title}`);
    // ...
  }
}
```

##### Ejemplo de log:

```bash
[BooksService] Creando libro: "Cien años de soledad"
```

---

## 🖥️ Frontend - Características Clave

![Selección_511](https://github.com/user-attachments/assets/e8354d27-485e-4fda-9306-a324b38450cf)

```bash
src/
├── api/               # Clientes API
├── components/        # Componentes reutilizables
│   ├── books/         # Componentes de libros
│   └── common/        # Componentes genéricos
├── context/           # Contextos React
├── hooks/             # Hooks personalizados
├── pages/             # Vistas principales
├── types/             # Tipos TypeScript
└── utils/             # Utilidades
```

## Estructura Principal

### Componentes reutilizables:

En /src/components/

BookCard, BookFilters, Pagination, etc.

### Páginas:

En /src/pages/

BooksPage, BookDetailPage, LoginPage, etc.

### Hooks personalizados:

En /src/hooks/

useAuth, useDebounce, usePagination

#### Hooks Importantes

useAuth: Manejo de autenticación

```bash
const { user, login, logout } = useAuth();
```

useDebounce: Para búsquedas

```bash
const debouncedSearch = useDebounce(searchTerm, 500);
```

usePagination: Gestión de paginación

```bash
const { currentPage, itemsPerPage, handlePageChange } = usePagination();
```

## Autenticación

El contexto de autenticación (AuthContext.tsx) maneja:

Estado del usuario

Token JWT

Funciones de login/logout

---

## 🐳 Docker Compose

```bash
services:
  db:
    image: postgres:16
    environment:
      POSTGRES_USER: user_cmpc_book
      POSTGRES_PASSWORD: 5L79D32cAiHw
      POSTGRES_DB: db_cmpc_books
    volumes:
      - postgres_data:/var/lib/postgresql/data

  backend:
    build: ./backend
    environment:
      DB_HOST: db
      DB_PORT: 5432
      DB_USER: user_cmpc_book
      DB_PASS: 5L79D32cAiHw
      DB_NAME: db_cmpc_books
    ports:
      - "3000:3000"

  frontend:
    build: ./frontend
    ports:
      - "5173:5173"
```

---

## Análisis de la Estructura de la Base de Datos

![Selección_512](https://github.com/user-attachments/assets/73d44d1e-bc3e-4448-96eb-a1a371e486ce)

### 1. Estructura General

La base de datos está diseñada para un sistema de gestión de librería con las siguientes características principales:

### Modelo relacional normalizado

11 tablas principales (5 entidades principales y 6 tablas de relación/seguimiento)

3 vistas para reportes comunes

2 triggers con funciones asociadas para automatizar procesos

### 2. Tablas Principales

Entidades Básicas:
editorial: Almacena información de las editoriales de los libros

genero: Catálogo de géneros literarios

autor: Información de los autores

libro: Datos principales de los libros (entidad central del sistema)

cliente: Registro de clientes de la librería

usuario: Usuarios del sistema con roles definidos

Tablas de Relación/Operativas:
libro_autor: Relación muchos-a-muchos entre libros y autores

venta: Registro de ventas

detalle_venta: Items de cada venta

inventario: Histórico de movimientos de stock

### 3. Relaciones Clave

Libro → Editorial: Muchos libros pertenecen a una editorial (N:1)

Libro → Género: Muchos libros pertenecen a un género (N:1)

Libro ↔ Autor: Relación muchos-a-muchos a través de libro_autor

Venta → Cliente: Una venta pertenece a un cliente (N:1)

DetalleVenta → Venta + Libro: Cada detalle relaciona un libro con una venta

### Características Destacables

Integridad Referencial:
Uso extensivo de FOREIGN KEY constraints

ON DELETE CASCADE en relaciones apropiadas (ej: libro_autor)

Validación de Datos:
CHECK constraints para campos como:

venta.estado (valores específicos)

inventario.tipo (entrada/salida/ajuste)

usuario.rol (admin/inventario/ventas)

Automatización:
Triggers para:

Actualizar stock automáticamente al registrar ventas

Registrar movimientos de inventario cuando cambia el stock

Valores por defecto:

stock en libros (default 0)

fecha_registro en varias tablas (CURRENT_TIMESTAMP)

5. Optimización
   Índices:
   Índices B-tree para búsquedas frecuentes (título, precio, stock)

Índice GIN para búsqueda de texto completo en título y descripción

Índices en campos de relación (id_cliente en venta)

Vistas:
vw_inventario_actual: Stock actual con información relacionada

vw_ventas_por_libro: Estadísticas de ventas por libro

vw_movimientos_inventario: Historial de movimientos con cálculo de stock anterior
