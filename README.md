# OpexAnalyser

**A full-stack operating expenditure (OPEX) analysis application.**

OpexAnalyser is a business-focused application designed to help organizations manage, track, and analyze operating expenses across departments and expense categories.

The project is being developed backend-first, with a focus on REST API development, database design, clean architecture, and practical full-stack engineering.

## Project Goals

- Manage and track business operating expenses.
- Organize expenses by category and department.
- Support budget planning and expense monitoring.
- Compare actual expenditure against budgets.
- Provide monthly and yearly expense insights.
- Import expense data from CSV and Excel files.
- Generate reports and financial summaries.
- Explore AI-powered expense analysis and anomaly detection.

## Technology Stack

### Backend
- Node.js
- TypeScript
- Express.js
- PostgreSQL
- Prisma ORM

### Frontend (Planned)
- Vue 3
- TypeScript
- Vite
- Pinia
- Vue Router
- Tailwind CSS
- Chart.js

### Development Tools
- Git and GitHub
- Postman
- pgAdmin
- Visual Studio Code

## Architecture

The application is being developed using a layered backend architecture.

```text
OpexAnalyser/
│
├── backend/
│   ├── prisma/
│   │   ├── migrations/
│   │   └── schema.prisma
│   │
│   ├── src/
│   │   ├── db/
│   │   ├── routes/
│   │   ├── types/
│   │   ├── app.ts
│   │   └── server.ts
│   │
│   ├── .env
│   ├── package.json
│   └── tsconfig.json
│
├── README.md
└── .gitignore
```

*The structure will evolve as additional application layers and features are introduced.*

## Current Development Status

### Completed
- [x] Initial Node.js and TypeScript project setup
- [x] Express.js server configuration
- [x] Basic API endpoints
- [x] Expense REST API with CRUD operations using temporary in-memory storage
- [x] PostgreSQL database setup
- [x] Initial Prisma schema and Expense model
- [x] Database migration
- [x] Prisma Client configuration
- [x] Database health-check endpoint implementation

### In Progress
- [ ] Verify database connectivity through the API
- [ ] Integrate Prisma with expense CRUD endpoints
- [ ] Replace temporary in-memory storage with PostgreSQL persistence
- [ ] Improve API validation and error handling
- [ ] Introduce service and repository layers

### Planned
- [ ] Department and expense category management
- [ ] Budget management
- [ ] Budget versus actual expenditure analysis
- [ ] Monthly and yearly reporting
- [ ] CSV and Excel imports
- [ ] Authentication and role-based authorization
- [ ] Automated testing with Jest and Supertest
- [ ] API documentation with Swagger/OpenAPI
- [ ] Vue 3 frontend
- [ ] Data visualization and dashboards
- [ ] Docker-based development environment
- [ ] CI/CD pipeline
- [ ] AI-assisted expense analysis

## Getting Started

### Prerequisites

Make sure you have installed:

- Node.js 20.19 or newer
- npm
- PostgreSQL
- Git

### 1. Clone the repository

```bash
git clone https://github.com/YOUR_USERNAME/OpexAnalyser.git
cd OpexAnalyser
```

### 2. Install backend dependencies

```bash
cd backend
npm install
```

### 3. Configure environment variables

Create a `.env` file inside the `backend` directory.

```env
DATABASE_URL="postgresql://postgres:YOUR_PASSWORD@localhost:5432/opex_analyser?schema=public"
```

Replace the database credentials with your local PostgreSQL configuration.

**Important:** Never commit your `.env` file or database credentials to GitHub.

### 4. Generate Prisma Client

```bash
npx prisma generate
```

### 5. Run database migrations

```bash
npx prisma migrate dev
```

### 6. Build the backend

```bash
npm run build
```

### 7. Start the development server

```bash
npm run dev
```

The API runs locally at:

```text
http://localhost:3000
```

## API Endpoints

The initial expense API supports the following operations:

| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/expenses` | Retrieve all expenses |
| GET | `/api/expenses/:id` | Retrieve an expense |
| POST | `/api/expenses` | Create an expense |
| PUT | `/api/expenses/:id` | Update an expense |
| DELETE | `/api/expenses/:id` | Delete an expense |
| GET | `/health` | API health check |
| GET | `/health/database` | Database health check |

*Expense endpoints initially use temporary in-memory storage; PostgreSQL integration is in progress.*

## Development Philosophy

OpexAnalyser is being developed incrementally, with an emphasis on:

- TypeScript-first development
- RESTful API design
- Maintainable and scalable architecture
- Database integrity and data consistency
- Input validation and secure coding practices
- Automated testing
- Production-ready development practices

## Roadmap

The development roadmap follows these major phases:

1. Backend foundations and Express.js
2. PostgreSQL and Prisma integration
3. Expense management and business logic
4. Authentication and authorization
5. Reporting, analytics, and data imports
6. Automated testing and API documentation
7. Vue 3 frontend development
8. Docker, CI/CD, and deployment
9. AI-assisted financial insights

## Project Status

<code>Active Development – Early Backend Stage</code>

This project is under active development. Features and architecture may change as development progresses.

## License

To be determined.