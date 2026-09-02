# Smart Employee Service Desk

A full-stack employee ticket management portal for creating, tracking, assigning, updating, and closing support requests across IT, HR, Facilities, Finance, and Access Management.

## Tech Stack

* **Frontend:** React, Vite, Axios, React Router
* **Backend:** Node.js, Express.js
* **Database:** Microsoft SQL Server
* **Validation:** Express Validator

## Features

* Create support tickets
* View and search tickets
* Filter by status and priority
* Assign tickets to support staff
* Change ticket priority and status
* Add resolution/update notes
* Close tickets
* Ticket activity history
* Frontend and backend validation
* Centralized API error handling
* Responsive UI

## Architecture

```text
React Frontend
      ↓
REST API
      ↓
Node.js + Express
      ↓
SQL Server
```

## Database

Main tables:

```text
Users
Departments
Categories
Tickets
Comments
```

Database scripts are available in:

```text
database/schema.sql
database/seed.sql
```

## API Endpoints

| Method | Endpoint                 | Description        |
| ------ | ------------------------ | ------------------ |
| GET    | `/api/health`            | API health check   |
| POST   | `/api/tickets`           | Create ticket      |
| GET    | `/api/tickets`           | Get tickets        |
| GET    | `/api/tickets/:id`       | Get ticket details |
| PUT    | `/api/tickets/:id`       | Update ticket      |
| PUT    | `/api/tickets/:id/close` | Close ticket       |
| GET    | `/api/tickets/users`     | Get support users  |

## Setup

### 1. Database

Run the following in SQL Server:

```text
database/schema.sql
database/seed.sql
```

### 2. Backend

```bash
cd backend
npm install
```

Create `.env`:

```env
PORT=5000
DB_USER=your_username
DB_PASSWORD=your_password
DB_SERVER=localhost
DB_NAME=EmployeeServiceDesk
```

Start:

```bash
npm run dev
```

### 3. Frontend

```bash
cd frontend
npm install
```

Create `.env`:

```env
VITE_API_URL=http://localhost:5000/api
```

Start:

```bash
npm run dev
```

Open the URL provided by Vite.

## Project Structure

```text
backend/
frontend/
database/
├── schema.sql
└── seed.sql
README.md
```

## Current Scope

Implemented through the core ticket-management workflow:

**Create → View → Assign → Update → Add Resolution Notes → Close**

Reporting dashboard, authentication, notifications, and SLA monitoring can be added as future enhancements.
