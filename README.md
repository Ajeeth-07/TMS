
# Task Management System

# Task Management System

A full-stack task management application built with React, TypeScript, Express, and PostgreSQL.

## Project Structure

- **Frontend**: React application with Tailwind CSS and TypeScript
- **Backend**: Express API with TypeScript, Prisma ORM, and PostgreSQL

## Features

- User authentication (signup/login)
- Create, read, update, and delete tasks
- Task prioritization (low, medium, high)
- Task completion tracking
- Responsive design

## Backend Setup

### Prerequisites

- Node.js (v16+)
- PostgreSQL database
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone https://github.com/Ajeeth-07/TMS.git
cd TMS/backend
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file in the backend directory:
```
DATABASE_URL="postgresql://username:password@localhost:5432/tms_db"
JWT_SECRET="your_secure_jwt_secret"
PORT=5000
```

4. Set up the database:
```bash
npx prisma migrate dev --name init
```

5. Generate Prisma client:
```bash
npx prisma generate
```

### Running the Backend

#### Development Mode
```bash
npm run build
npm run start
```

#### Production Mode
```bash
npm run build
npm run start
```

### API Endpoints

#### Authentication
- `POST /api/auth/signup` - Register a new user
- `POST /api/auth/login` - Authenticate user and get token

#### Tasks
- `GET /api/tasks` - Get all tasks for authenticated user
- `GET /api/tasks/:id` - Get a specific task
- `POST /api/tasks` - Create a new task
- `PUT /api/tasks/:id` - Update a task
- `DELETE /api/tasks/:id` - Delete a task

### Environment Variables

| Variable | Description |
|----------|-------------|
| DATABASE_URL | PostgreSQL connection string |
| JWT_SECRET | Secret key for JWT token generation |
| PORT | Port on which server runs (default: 5000) |

### Technologies Used

- **TypeScript**: For type-safe code
- **Express**: Web framework
- **Prisma**: ORM for database operations
- **PostgreSQL**: Database
- **JWT**: Authentication
- **Zod**: Input validation
- **Bcrypt**: Password hashing

## Frontend Setup

### Prerequisites

- Node.js (v16+)
- npm or yarn

### Installation

1. Navigate to the frontend directory:
```bash
cd TMS/frontend
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file in the frontend directory (optional):
```
VITE_API_URL=http://localhost:5000/api
```

### Running the Frontend

#### Development Mode
```bash
npm run dev
```

#### Production Build
```bash
npm run build
npm run preview
```

### Features

- **Authentication**: User registration and login
- **Dashboard**: View all tasks with pagination
- **Task Management**: 
  - Create new tasks
  - Edit existing tasks
  - Mark tasks as completed
  - Delete tasks
  - Set task priority
- **Responsive Design**: Works on desktop and mobile devices

### Technologies Used

- **React**: UI library
- **TypeScript**: For type-safe code
- **React Router**: For navigation
- **Tailwind CSS**: For styling
- **Axios**: For API requests
- **Framer Motion**: For animations
- **Vite**: Build tool

### Project Structure

```
frontend/
├── public/
├── src/
│   ├── components/
│   │   ├── auth/           # Authentication components
│   │   ├── dashboard/      # Dashboard components
│   │   └── tasks/          # Task-related components
│   ├── interfaces/         # TypeScript interfaces
│   ├── services/           # API service
│   ├── App.tsx             # Main application component
│   └── main.tsx            # Entry point
└── ...config files
```

### Additional Configuration

- The frontend is configured to connect to a backend API at `http://localhost:5000/api`
- To change this, modify the `baseURL` in `src/services/api.ts`

### Authentication Flow

1. User registers or logs in
2. JWT token is stored in localStorage
3. Token is included in API requests via Axios interceptor
4. Protected routes redirect to login if no token exists

## Getting Started with the Complete Application

1. Start the backend server (from backend directory):
```bash
npm run build
npm run start
```

2. Start the frontend development server (from frontend directory):
```bash
npm run dev
```

3. Open your browser and navigate to:
```
http://localhost:5173
```

4. Register a new account and start managing your tasks!

