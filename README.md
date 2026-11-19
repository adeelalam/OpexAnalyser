# OpexAnalyser

A full-stack operating expense management and analysis application built with **Node.js, TypeScript, Express.js, PostgreSQL, Prisma ORM and Vue 3**.

OpexAnalyser aims to help organizations manage operating expenses, monitor budgets, analyze spending patterns and make better financial decisions.

## Project Goals

- Manage and track operating expenses.
- Organize expenses by category and department.
- Monitor monthly and yearly budgets.
- Compare actual expenses against allocated budgets.
- Visualize expense trends and spending patterns.
- Import and export expense data.
- Generate financial reports.
- Identify unusual spending and potential cost-saving opportunities.
- Explore AI-powered financial insights.

## Technology Stack

### Backend

| Technology           | Purpose                          |
| -------------------- | -------------------------------- |
| Node.js              | JavaScript runtime               |
| TypeScript           | Type safety                      |
| Express.js           | REST API                         |
| PostgreSQL           | Relational database              |
| Prisma ORM           | Database access and migrations   |
| bcryptjs             | Password hashing                 |
| JSON Web Token (JWT) | Authentication and authorization |

### Frontend

| Technology      | Purpose                                     |
| --------------- | ------------------------------------------- |
| Vue 3           | Frontend framework                          |
| TypeScript      | Type safety                                 |
| Vite            | Development server and build tool           |
| Vue Router      | Application navigation and route protection |
| Pinia           | State management                            |
| Tailwind CSS    | Styling                                     |
| Lucide Vue Next | Icons                                       |
| Axios           | API communication                           |
| Chart.js        | Data visualization                          |

## Project Structure

```text
OpexAnalyser/
│
├── backend/
│   ├── prisma/
│   │   ├── migrations/
│   │   └── schema.prisma
│   │
│   ├── src/
│   │   ├── controllers/
│   │   ├── db/
│   │   ├── middleware/
│   │   ├── routes/
│   │   ├── services/
│   │   ├── types/
│   │   ├── app.ts
│   │   └── server.ts
│   │
│   ├── .env
│   └── package.json
│
├── frontend/
│   ├── src/
│   │   ├── assets/
│   │   ├── components/
│   │   │   └── layout/
│   │   ├── router/
│   │   ├── services/
│   │   ├── stores/
│   │   ├── types/
│   │   ├── views/
│   │   ├── App.vue
│   │   └── main.ts
│   │
│   └── package.json
│
└── README.md
```

## Getting Started

### Prerequisites

Install the following:

- Node.js and npm
- PostgreSQL
- Git

### 1. Clone the repository

```bash
git clone https://github.com/adeelalam/OpexAnalyser.git
cd OpexAnalyser
```

### 2. Configure the backend

Navigate to the backend directory and install dependencies:

```bash
cd backend
npm install
```

Create a `.env` file inside the `backend` directory:

```env
DATABASE_URL="postgresql://USERNAME:PASSWORD@localhost:5432/opex_analyser"
JWT_SECRET="YOUR_LONG_RANDOM_SECRET"
JWT_EXPIRES_IN="1h"
```

Replace the database username and password with your local PostgreSQL credentials.

Use a strong, randomly generated JWT secret. Never commit your `.env` file or expose its secrets.

Apply database migrations:

```bash
npx prisma migrate dev
```

Generate the Prisma client if required:

```bash
npx prisma generate
```

Start the backend development server:

```bash
npm run dev
```

The backend API runs at:

http://localhost:3000

### 3. Configure the frontend

Open another terminal and navigate to the frontend directory:

```bash
cd frontend
npm install
```

Create a `.env` file inside the `frontend` directory:

```env
VITE_API_BASE_URL=http://localhost:3000
```

Start the frontend development server:

```bash
npm run dev
```

The frontend runs at:

http://localhost:5173

### 4. Build for production

Backend:

```bash
cd backend
npm run build
```

Frontend:

```bash
cd frontend
npm run build
```

## Running with Docker Compose

### Prerequisites

- Docker Desktop installed and running.
- PostgreSQL running on the host machine.
- A configured Docker environment file.

### Environment Configuration

Create `backend/.env.docker` using the required environment variables documented in `backend/.env.example`.

For the PostgreSQL connection, use `host.docker.internal` as the database hostname because PostgreSQL runs on the host machine rather than inside Docker.

Keep environment files containing passwords, JWT secrets, or other credentials out of Git.

### Start the Backend

Run these commands from the project root:

```bash
docker compose up -d --build
```

This builds the backend image and starts the container.

### Check Container Status

```bash
docker compose ps
```

The backend should report a healthy status.

### View Backend Logs

```bash
docker compose logs -f backend
```

Press `Ctrl+C` to stop following the logs.

### Stop the Backend

```bash
docker compose down
```

### Restart the Backend

```bash
docker compose restart backend
```

### API Health Checks

Once the container is running, access:

- API health: http://localhost:3000/health
- Database health: http://localhost:3000/health/database

The backend is published on `127.0.0.1:3000`, so it is accessible locally rather than through other network interfaces.

### Docker Configuration

- `backend/Dockerfile` — Multi-stage production build.
- `backend/.dockerignore` — Excludes unnecessary files and secrets from the build context.
- `docker-compose.yml` — Defines the backend service, environment configuration, port mapping, restart policy and health check.

## Current Features

### Expense Management

- Create, retrieve, update and delete expenses.
- Organize expenses by category and department.
- Store expense information in PostgreSQL.
- Communicate with the backend through REST APIs.

### Dashboard and Analytics

- Dashboard summary cards.
- Expense visualizations using Chart.js.
- Monthly expense trends.
- Expense data retrieved from the backend.

### Authentication and Security

- User registration and login.
- Password hashing using bcryptjs.
- JWT-based authentication.
- Protected API endpoints.
- Protected frontend routes.
- Automatic JWT attachment to API requests using Axios interceptors.
- Session persistence using browser local storage.
- Logout functionality.
- User-specific expense access and ownership isolation.

## API Endpoints

### Authentication

| Method | Endpoint             | Description         | Access |
| ------ | -------------------- | ------------------- | ------ |
| POST   | `/api/auth/register` | Register a new user | Public |
| POST   | `/api/auth/login`    | Authenticate a user | Public |

### Expenses

All expense endpoints require a valid JWT access token.

Include the following HTTP header:

```http
Authorization: Bearer YOUR_JWT_TOKEN
```

| Method | Endpoint            | Description                            |
| ------ | ------------------- | -------------------------------------- |
| GET    | `/api/expenses`     | Retrieve authenticated user's expenses |
| GET    | `/api/expenses/:id` | Retrieve an expense                    |
| POST   | `/api/expenses`     | Create an expense                      |
| PUT    | `/api/expenses/:id` | Update an expense                      |
| DELETE | `/api/expenses/:id` | Delete an expense                      |

### Health Checks

| Method | Endpoint           | Description               |
| ------ | ------------------ | ------------------------- |
| GET    | `/health`          | API health check          |
| GET    | `/health/database` | Database connection check |

## Development Progress

### Completed

- [x] Node.js and TypeScript backend foundation
- [x] Express.js REST API
- [x] PostgreSQL database integration
- [x] Prisma ORM integration
- [x] Expense CRUD API
- [x] Layered backend architecture
- [x] Centralized API error handling
- [x] Vue 3 frontend foundation
- [x] Tailwind CSS integration
- [x] Reusable sidebar and header components
- [x] Dashboard interface
- [x] Application routing
- [x] Interactive dashboard charts
- [x] Expense management interface
- [x] Frontend and backend integration
- [x] Pinia state management
- [x] User registration and login
- [x] JWT authentication and authorization
- [x] Protected frontend routes
- [x] Protected backend API endpoints
- [x] User-specific expense ownership
- [x] Authentication session persistence
- [x] Logout functionality
- [x] Manual authentication and API testing
- [x] Backend Docker containerization
- [x] Multi-stage production Docker build
- [x] Docker Compose configuration
- [x] Docker health checks
- [x] Docker restart policy
- [x] Local-only backend port binding

### Remaining

### Remaining

- [ ] CSV expense export
- [ ] CSV expense import
- [ ] Excel import and export
- [ ] Budget management
- [ ] Advanced financial reporting
- [ ] Advanced analytics
- [ ] Automated backend and frontend testing
- [ ] Improved responsive navigation
- [ ] Production security improvements
- [ ] Cloud deployment
- [ ] Production database hosting
- [ ] CI/CD pipeline

## Learning Objectives

This project is also a practical full-stack learning exercise, focusing on:

- REST API design and backend architecture.
- TypeScript and Node.js development.
- Database design and ORM integration.
- Authentication and application security.
- Frontend component architecture.
- API communication and state management.
- Data visualization and financial analytics.
- Testing and production deployment.

## License

This project is currently under development.
