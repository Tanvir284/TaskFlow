# Task-Flow — A Personal Task Manager

A full-stack task management application built for the Junior Full-Stack Developer fellowship assignment. Task-Flow allows a single user to create, view, edit, complete, and delete tasks through a clean browser-based interface backed by a REST API and persistent SQLite database.

> **🚀 Live Demo:** [https://task-flow-tau-murex.vercel.app](https://task-flow-tau-murex.vercel.app)
> 
> *Frontend hosted on Vercel. Backend API hosted on Render.*
> 
> ⚠️ **Note for Reviewers:** The backend is hosted on Render's free tier, which goes to sleep after 15 minutes of inactivity. **The first request may take 30-60 seconds to wake up.** Additionally, Render's free tier uses an ephemeral filesystem, meaning the SQLite database will reset to empty when the server sleeps. For a permanent database experience, please run the project locally.
---

##  Features

### Core Features
- **View all tasks** — displays title, description, status badge, and creation date
- **Add a task** — form with required title and optional description
- **Edit a task** — inline edit mode with save/cancel and validation
- **Toggle task status** — single-click checkbox to switch between pending and completed
- **Delete a task** — with browser confirmation dialog before removal
- **Input validation** — both frontend and backend reject empty/blank titles
- **Persistent storage** — SQLite database survives refreshes and server restarts
- **Mobile responsive** — fully usable on phones, tablets, and desktops

### Bonus Features
- **Filter by status** — All / Pending / Completed filter bar with task counts
- **Backend tests** — lightweight Vitest + Supertest tests for API validation and CRUD
- **Context-aware empty states** — different messages based on active filter

---

##  Tech Stack

| Layer      | Technology                     |
| ---------- | ------------------------------ |
| Frontend   | React 19 + Vite                |
| Backend    | Node.js + Express              |
| Database   | SQLite (via better-sqlite3)    |
| Language   | JavaScript (ES modules + CJS)  |
| Styling    | Custom CSS (hand-written)      |
| HTTP       | Fetch API                      |
| Testing    | Vitest + Supertest             |

---

##  Project Structure

```
task-flow/
├── backend/
│   ├── src/
│   │   ├── config/
│   │   │   └── env.js              # Centralized environment config
│   │   ├── db/
│   │   │   ├── connection.js        # SQLite connection singleton
│   │   │   └── init.js              # Database schema initialization
│   │   ├── middleware/
│   │   │   ├── errorHandler.js      # Global error handler
│   │   │   ├── notFound.js          # 404 catch-all
│   │   │   └── validateTask.js      # Request body validation
│   │   ├── models/
│   │   │   └── taskModel.js         # Data access layer (SQL queries)
│   │   ├── controllers/
│   │   │   └── taskController.js    # Route handlers
│   │   ├── routes/
│   │   │   └── taskRoutes.js        # Route definitions
│   │   ├── utils/
│   │   │   ├── apiResponse.js       # Response shape helpers
│   │   │   └── asyncHandler.js      # Async error wrapper
│   │   ├── app.js                   # Express app setup
│   │   └── server.js                # Entry point
│   ├── tests/
│   │   └── taskRoutes.test.js       # API integration tests
│   ├── .env.example
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── TaskForm.jsx         # New task creation form
│   │   │   ├── TaskItem.jsx         # Individual task card (view + edit)
│   │   │   ├── TaskList.jsx         # Task list container
│   │   │   ├── FilterBar.jsx        # Status filter buttons
│   │   │   ├── EmptyState.jsx       # No-tasks placeholder
│   │   │   ├── ErrorMessage.jsx     # Error banner
│   │   │   └── LoadingState.jsx     # Loading spinner
│   │   ├── services/
│   │   │   └── taskService.js       # Centralized API calls
│   │   ├── utils/
│   │   │   └── formatDate.js        # Date formatting helper
│   │   ├── styles/
│   │   │   ├── reset.css            # CSS reset
│   │   │   ├── variables.css        # Design tokens
│   │   │   └── app.css              # All component styles
│   │   ├── App.jsx                  # Root component
│   │   └── main.jsx                 # React entry point
│   ├── index.html
│   ├── vite.config.js
│   └── package.json
└── README.md
```

---

##  Prerequisites

Make sure you have the following installed:

- **Node.js** — v18 or higher ([download](https://nodejs.org/))
- **npm** — comes with Node.js
- **Git** — to clone the repository

Verify installation:
```bash
node -v   # should print v18+
npm -v    # should print 9+
```

---

##  Getting Started

### 1. Clone the repository

```bash
git clone <repository-url>
cd task-flow
```

### 2. Set up the Backend

```bash
cd backend

# Install dependencies
npm install

# Create environment file from template
cp .env.example .env
# (On Windows: copy .env.example .env)

# Start the backend server
npm run dev
```

The API server will start at **http://localhost:5000**.  
The SQLite database file (`taskflow.db`) is created automatically on first run.

### 3. Set up the Frontend

Open a **new terminal**:

```bash
cd frontend

# Install dependencies
npm install

# Start the development server
npm run dev
```

The frontend will start at **http://localhost:5173**.  
It proxies all `/api/*` requests to the backend automatically (configured in `vite.config.js`).

### 4. Open the App

Navigate to **http://localhost:5173** in your browser. You're ready to go!

---

## ⚙️ Environment Variables

| Variable      | Default                   | Description                          |
| ------------- | ------------------------- | ------------------------------------ |
| `PORT`        | `5000`                    | Backend server port                  |
| `DB_PATH`     | `./taskflow.db`           | Path to SQLite database file         |
| `CORS_ORIGIN` | `http://localhost:5173`   | Allowed CORS origin (frontend URL)   |
| `NODE_ENV`    | `development`             | Environment mode                     |

---

## � Database

- **Engine:** SQLite (file-based, no separate server needed)
- **Library:** `better-sqlite3` (synchronous, fast native bindings)
- **Initialization:** The `tasks` table is created automatically when the backend starts — no manual migration step needed
- **File location:** `backend/taskflow.db` (auto-created on first run)
- **Persistence:** Data survives server restarts and browser refreshes

### Schema

```sql
CREATE TABLE tasks (
  id          INTEGER PRIMARY KEY AUTOINCREMENT,
  title       VARCHAR(255) NOT NULL,
  description TEXT,
  status      TEXT NOT NULL DEFAULT 'pending' CHECK(status IN ('pending', 'completed')),
  created_at  DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at  DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);
```

---

## � API Endpoints

All endpoints return JSON with a consistent response shape.

| Method   | Endpoint                   | Description                    | Status Codes     |
| -------- | -------------------------- | ------------------------------ | ---------------- |
| `GET`    | `/api/tasks`               | Retrieve all tasks             | 200              |
| `POST`   | `/api/tasks`               | Create a new task              | 201, 400         |
| `PUT`    | `/api/tasks/:id`           | Update a task                  | 200, 400, 404    |
| `PATCH`  | `/api/tasks/:id/toggle`    | Toggle task status             | 200, 404         |
| `DELETE` | `/api/tasks/:id`           | Delete a task                  | 200, 404         |

### Response Format

**Success:**
```json
{
  "success": true,
  "message": "Task created successfully",
  "data": { "id": 1, "title": "...", "status": "pending", ... }
}
```

**Validation Error (400):**
```json
{
  "success": false,
  "message": "Validation failed",
  "error": {
    "code": "VALIDATION_ERROR",
    "details": "Title is required and cannot be empty."
  }
}
```

**Not Found (404):**
```json
{
  "success": false,
  "message": "Task not found",
  "error": { "code": "NOT_FOUND" }
}
```

---

##  Validation & Error Handling

### Frontend Validation
- Empty/blank title is blocked before the request is sent
- Visible inline error message appears below the input
- Error clears when the user starts typing

### Backend Validation
- `POST /api/tasks` — rejects missing or blank title with 400
- `PUT /api/tasks/:id` — rejects if no valid fields provided, rejects blank title, rejects invalid status values
- Non-existent task IDs return 404
- Unmatched routes return 404 JSON (not HTML)
- Unexpected errors return 500 with no stack trace leakage

---

## 🧪 Running Tests

```bash
cd backend
npm test
```

Tests use **Vitest** + **Supertest** and cover:
- `POST /api/tasks` returns 400 for missing title
- `POST /api/tasks` returns 400 for blank (whitespace-only) title
- `POST /api/tasks` returns 201 for valid task creation
- `GET /api/tasks` returns 200 with an array
- `DELETE /api/tasks/:id` returns 404 for non-existent ID

---

## � Bonus Features Implemented

1. **Filter by status** — All / Pending / Completed filter bar with live task counts
2. **Backend API tests** — 5 integration tests covering validation, creation, listing, and 404 handling
3. **Context-aware empty states** — different messages depending on whether the list is truly empty vs. filtered empty

---

## ⚖️ Tradeoffs & Assumptions

- **No authentication** — the spec explicitly requires a single-user app without auth
- **`better-sqlite3` over `sqlite3`** — synchronous API is simpler and avoids callback complexity for this scale; WAL mode is enabled for safe concurrent reads
- **Vite dev proxy** — API calls use relative paths (`/api/tasks`) and Vite proxies them to the backend in development, avoiding CORS issues during dev
- **No ORM** — raw parameterized SQL keeps the data layer transparent and simple
- **CSS in one file** — at this project size, a single `app.css` importing design tokens from `variables.css` is more maintainable than scattered CSS modules
- **`window.confirm` for delete** — simple and universally supported; a custom modal would add complexity without adding value for this scope

---

## � What I Would Improve With More Time

- **Due dates and priority levels** — add fields and sort/filter by urgency
- **Search functionality** — full-text search across titles and descriptions
- **Drag-and-drop reordering** — manual task ordering with a position column
- **Dark mode toggle** — using CSS custom properties (design tokens are already set up for easy theming)
- **Custom confirmation modal** — replace `window.confirm` with a styled in-app dialog
- **Pagination or virtual scrolling** — for very large task lists
- **E2E tests** — Playwright or Cypress for full user flow testing
- **Production deployment** — Docker, CI/CD pipeline, and hosting

---

## 🤖 Note on AI Assistance

This project was developed with the assistance of AI tools for code generation and architectural decisions. All code was reviewed, understood, and verified for correctness. The design decisions, architecture, and implementation strategy were guided by the assignment requirements and best practices for a production-like CRUD application.

---

## � License

MIT
