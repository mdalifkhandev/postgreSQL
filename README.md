# PostgreSQL Auth Backend

This project is a modular TypeScript backend built with Express and PostgreSQL for authentication and authorization.

## Features

- User registration and login
- Modular architecture with `modules`, `services`, `controllers`, and shared middleware
- Password hashing with `bcryptjs`
- JWT-based authentication
- JWT cookie is set automatically on login/register
- HttpOnly auth cookie for safer token handling
- Role-based authorization for admin routes
- PostgreSQL schema initialization script
- Optional admin seeding from environment variables
- TypeScript build output in `dist/`

## Setup

1. Install dependencies:

   ```bash
   npm install
   ```

2. Create your environment file:

   ```bash
   Copy-Item .env.example .env
   ```

3. Update `.env` values if needed.
   Set `CLIENT_ORIGIN` to your frontend or API client origin.

4. Initialize the database schema:

   ```bash
   npm run db:init
   ```

5. Start the server:

   ```bash
   npm run dev
   ```

6. Build for production:

   ```bash
   npm run build
   npm start
   ```

## Project Structure

```txt
src/
  config/
  database/
  modules/
    auth/
    user/
  shared/
    middleware/
    utils/
  types/
  app.ts
  server.ts
```

## API Endpoints

- `GET /api/health`
- `POST /api/auth/register`
- `POST /api/auth/login`
- `POST /api/auth/logout`
- `GET /api/auth/me` (protected)
- `GET /api/users/profile` (protected)
- `GET /api/users` (admin only)

## Example Request Body

### Register

```json
{
  "name": "Alif",
  "email": "alif@example.com",
  "password": "secret123"
}
```

### Login

```json
{
  "email": "alif@example.com",
  "password": "secret123"
}
```
