# Task Management Application

A full-stack Task Management Application built with:

- **Frontend:** Next.js (App Router), TypeScript, Tailwind CSS
- **Backend:** Node.js, Express.js
- **Database:** PostgreSQL (Prisma ORM)
- **Authentication:** JWT (Access + Refresh Tokens using HTTP-only cookies)

---

##  Features

### Authentication
- User Registration
- User Login
- JWT-based authentication
- HTTP-only cookies 
- Automatic Access Token refresh using Refresh Token
- Logout functionality
- Protected routes

---

###  Task Management
- Create Task
- View Tasks (Paginated)
- Search Tasks
- Filter Tasks (All / Completed / Pending)
- View Single Task
- Edit Task Title
- Toggle Task Status
- Delete Task

---

### UI Features
- Clean and responsive UI using Tailwind CSS
- Toast notifications 
- Task Detail page
- Pagination support

---

## Tech Stack

### Frontend
- Next.js 14 (App Router)
- TypeScript
- Tailwind CSS
- React Hot Toast

### Backend
- Node.js
- Express.js
- Prisma ORM
- PostgreSQL
- JWT Authentication

---

## Authentication Flow

1. User logs in → Access Token & Refresh Token generated
2. Tokens stored in HTTP-only cookies
3. Access Token used for protected routes
4. When Access Token expires:
   - Frontend automatically calls `/api/auth/refresh`
   - New Access Token is issued
   - User remains logged in
5. Logout clears both tokens

---

