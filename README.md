# DevPulse — Internal Tech Issue and Feature Tracker

[![Live Demo](https://img.shields.io/badge/live-demo-blue?style=flat-square)](https://dev-pulse-internal-tech-issue-and-f.vercel.app)

A professional internal issue and feature tracking API built with Node.js, Express, PostgreSQL, and JWT authentication.

## Overview

DevPulse provides a lightweight backend for tracking bugs and feature requests, with role-based access control and secure JWT authentication.

## Live URL

- https://dev-pulse-internal-tech-issue-and-f.vercel.app

## Key Features

- User registration and login with JWT access tokens
- Refresh token support using secure HTTP-only cookies
- Issue reporting for `bug` and `feature_request`
- Role-based authorization for updates and delete operations
- Issue filtering by `type` and `status`

## Tech Stack

- Node.js
- TypeScript
- Express
- PostgreSQL
- jsonwebtoken
- bcrypt
- Vercel

## Setup

1. Clone the repository:

   ```bash
   git clone https://github.com/maruf-hasan-rion/DevPulse--Internal-Tech-Issue-and-Feature-Tracker

   cd DevPulse--Internal-Tech-Issue-and-Feature-Tracker
   ```

2. Install dependencies:
   ```bash
   npm install
   ```
3. Create a `.env` file with:
   ```env
   DATABASE_URL=your_database_url
   PORT=5000
   JWT_SECRET=your_access_secret
   JWT_REFRESH_SECRET=your_refresh_secret
   NODE_ENV=development
   ```
4. Start the development server:
   ```bash
   npm run dev
   ```

## API Endpoints

### Authentication

| Method | Endpoint                  | Description                             |
| ------ | ------------------------- | --------------------------------------- |
| POST   | `/api/auth/signup`        | Register a new user                     |
| POST   | `/api/auth/login`         | Login and receive an access token       |
| POST   | `/api/auth/refresh-token` | Refresh access token via refresh cookie |

### Issues

| Method | Endpoint          | Description                                        |
| ------ | ----------------- | -------------------------------------------------- |
| GET    | `/api/issues`     | Fetch all issues                                   |
| GET    | `/api/issues/:id` | Fetch a single issue                               |
| POST   | `/api/issues`     | Create a new issue (`contributor` or `maintainer`) |
| PATCH  | `/api/issues/:id` | Update issue (`contributor` or `maintainer`)       |
| DELETE | `/api/issues/:id` | Delete issue (`maintainer` only)                   |

## Database Schema

### `users`

| Field        | Type         | Notes                         |
| ------------ | ------------ | ----------------------------- |
| `id`         | SERIAL       | Primary key                   |
| `name`       | VARCHAR(100) | Required                      |
| `email`      | VARCHAR(255) | Required, unique              |
| `password`   | TEXT         | Hashed password               |
| `role`       | VARCHAR(20)  | `contributor` or `maintainer` |
| `created_at` | TIMESTAMP    | Default `NOW()`               |
| `updated_at` | TIMESTAMP    | Default `NOW()`               |

### `issues`

| Field         | Type         | Notes                                            |
| ------------- | ------------ | ------------------------------------------------ |
| `id`          | SERIAL       | Primary key                                      |
| `title`       | VARCHAR(150) | Required                                         |
| `description` | TEXT         | Required, min 20 chars                           |
| `type`        | VARCHAR(20)  | `bug` or `feature_request`                       |
| `status`      | VARCHAR(20)  | `open`, `in_progress`, `resolved`                |
| `reporter_id` | INTEGER      | User ID reference (application-level validation) |
| `created_at`  | TIMESTAMP    | Default `NOW()`                                  |
| `updated_at`  | TIMESTAMP    | Default `NOW()`                                  |

## Best Practices

- Never commit JWT secrets or database credentials
- Use HTTPS in production for secure cookies
- Validate request bodies before database inserts
- Do not expose password fields in responses

## Notes

- The project uses Vercel for deployment and `vercel.json` to route requests to the compiled server entry.
- The app currently accepts both `Bearer <token>` and plain token values in the `Authorization` header.
