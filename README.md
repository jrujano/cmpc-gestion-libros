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

#### Seeders

Ubicación: backend/src/modules/shared/database/seeders/

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

---

## 🖥️ Frontend - Características Clave

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
