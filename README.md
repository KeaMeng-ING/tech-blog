# Tech Blog

A full-stack tech news aggregator and blog platform built as a university project (INFO-653 Web Development III). It automatically fetches articles from major tech RSS feeds and trending GitHub repositories, and lets admins create and publish their own posts with a newsletter delivery system.

---

## Architecture

```
tech-blog/
├── tech-blog-backend/   # Express 5 + TypeScript + Prisma
└── tech-blog-frontend/  # Next.js 16 + React 19 + Tailwind CSS
```

**Stack:**

| Layer    | Technology                                   |
|----------|----------------------------------------------|
| Frontend | Next.js 16 (App Router), React 19, Tailwind CSS |
| Backend  | Express 5, TypeScript, Zod validation        |
| Database | PostgreSQL via Neon (Prisma ORM)             |
| Auth     | JWT + bcrypt                                 |
| Email    | Nodemailer                                   |

---

## Features

- **Auto news aggregation** — RSS feeds from Google, AWS, Microsoft, OpenAI, The Verge, and Hacker News are fetched every 6 hours on server start
- **Trending GitHub repos** — fetches repos from the past 7 days with 10+ stars via the GitHub Search API
- **Manual posts** — admins can create posts with DRAFT / SCHEDULED / PUBLISHED statuses
- **Newsletter** — subscribers choose topics and a delivery time; admins can send newsletters manually or trigger them via the dashboard
- **Admin dashboard** — manage posts, categories, users, and newsletter history
- **Role-based access** — USER and ADMIN roles enforced via JWT middleware

---

## Getting Started

### Prerequisites

- Node.js 18+
- A [Neon](https://neon.tech) PostgreSQL database (or any PostgreSQL instance)

### Backend

```bash
cd tech-blog-backend
npm install
```

Create a `.env` file:

```env
DATABASE_URL=postgresql://user:password@host/dbname
JWT_SECRET=your_jwt_secret
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_email_app_password
```

Run migrations and start:

```bash
npx prisma migrate deploy
npm run dev        # development (nodemon)
npm start          # production
```

The API runs on `http://localhost:3000`.

### Frontend

```bash
cd tech-blog-frontend
npm install
npm run dev
```

The frontend runs on `http://localhost:3001` and expects the backend at `http://localhost:3000/api`.

---

## API Overview

Full API docs are in [`tech-blog-backend/readme.md`](tech-blog-backend/readme.md). Key routes:

| Method | Route | Auth | Description |
|--------|-------|------|-------------|
| POST | `/api/auth/register` | Public | Register a new user |
| POST | `/api/auth/login` | Public | Login and receive a JWT |
| GET | `/api/posts` | Public | List posts (filter by category, status, search) |
| GET | `/api/posts/:id` | Public | Get a single post |
| POST | `/api/posts` | Admin | Create a post |
| GET | `/api/github/trending` | Public | Top 10 trending GitHub repos |
| POST | `/api/subscription` | User | Subscribe to newsletter topics |
| POST | `/api/admin/newsletter/send` | Admin | Manually send newsletter |
| GET | `/api/admin/stats` | Admin | Dashboard stats |
| POST | `/api/news-automation/trigger` | Admin | Manually refresh news feed |

Protected routes require:

```
Authorization: Bearer <jwt_token>
```

---

## News Sources

The backend fetches from these RSS feeds automatically every 6 hours:

- Google Developers Blog
- AWS News Blog
- Microsoft Tech Community
- OpenAI Blog
- The Verge
- Hacker News (top stories)

To add or change sources, edit `FEED_SOURCES` in `tech-blog-backend/src/services/feedFetcher.service.ts`.

---

## Project Structure

```
tech-blog-backend/src/
├── app.ts                    # Express entry point
├── controllers/              # Route handlers
├── routes/                   # Express routers
├── schema/                   # Zod validation schemas
├── middleware/               # Auth & role middleware
├── services/                 # RSS fetcher, GitHub fetcher, news aggregator
├── jobs/                     # 6-hour news fetch interval job
└── utils/                    # Password hashing, response helpers

tech-blog-frontend/app/
├── (main)/                   # Public-facing pages (home, articles, github, newsletter)
├── (admin)/admin/            # Admin dashboard (posts, categories, users, newsletters)
└── components/               # Navbar, Footer, shared UI
```

---

## License

MIT
