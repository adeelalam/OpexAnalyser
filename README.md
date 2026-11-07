# OpexAnalyser

A full-stack operating expense management and analysis application built with **Node.js, TypeScript, Express, PostgreSQL, Prisma and Vue 3**.

OpexAnalyser aims to help organizations manage operating expenses, monitor budgets, analyze spending patterns and make better financial decisions.

## Project Goals

- Manage and track operating expenses.
- Organize expenses by category and department.
- Monitor monthly and yearly budgets.
- Compare actual expenses against allocated budgets.
- Visualize expense trends and spending patterns.
- Import expense data from CSV and Excel files.
- Identify unusual spending and potential cost-saving opportunities.
- Explore AI-powered financial insights.

## Technology Stack

### Backend

| Technology | Purpose                        |
| ---------- | ------------------------------ |
| Node.js    | JavaScript runtime             |
| TypeScript | Type safety                    |
| Express.js | REST API                       |
| PostgreSQL | Relational database            |
| Prisma ORM | Database access and migrations |

### Frontend

| Technology      | Purpose                           |
| --------------- | --------------------------------- |
| Vue 3           | Frontend framework                |
| TypeScript      | Type safety                       |
| Vite            | Development server and build tool |
| Vue Router      | Application navigation            |
| Pinia           | State management                  |
| Tailwind CSS    | Styling                           |
| Lucide Vue Next | Icons                             |
| Axios           | API communication (planned)       |
| Chart.js        | Data visualization (planned)      |

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
│   │   ├── stores/
│   │   ├── services/
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

```bash
cd backend
npm install
```

Create a `.env` file inside the backend directory and configure your PostgreSQL connection:

```env
DATABASE_URL="postgresql://USERNAME:PASSWORD@localhost:5432/opex_analyser"
```

Replace the username and password with your local PostgreSQL credentials.

Apply pending Prisma migrations:

```bash
npx prisma migrate dev
```

Start the backend development server:

```bash
npm run dev
```

The API runs at:

`http://localhost:3000`

### 3. Configure the frontend

Open another terminal:

```bash
cd frontend
npm install
npm run dev
```

The frontend runs at:

`http://localhost:5173`

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

## Current API Endpoints

| Method | Endpoint            | Description               |
| ------ | ------------------- | ------------------------- |
| GET    | `/health`           | API health check          |
| GET    | `/health/database`  | Database connection check |
| GET    | `/api/expenses`     | Retrieve all expenses     |
| GET    | `/api/expenses/:id` | Retrieve an expense       |
| POST   | `/api/expenses`     | Create an expense         |
| PUT    | `/api/expenses/:id` | Update an expense         |
| DELETE | `/api/expenses/:id` | Delete an expense         |

## Development Progress

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
- [x] Initial dashboard interface
- [x] Application routing
- [ ] Interactive dashboard charts
- [ ] Responsive navigation
- [ ] Complete expense management interface
- [ ] Frontend and backend integration
- [ ] OPEX business logic
- [ ] Authentication and authorization
- [ ] CSV/Excel imports
- [ ] Advanced reporting and analytics
- [ ] Automated testing
- [ ] Production deployment

## Learning Objectives

This project is also a practical full-stack learning exercise, focusing on:

- REST API design and backend architecture.
- TypeScript and Node.js development.
- Database design and ORM integration.
- Frontend component architecture.
- API communication and state management.
- Data visualization and financial analytics.
- Testing, security and deployment.

## License

This project is currently under development.
