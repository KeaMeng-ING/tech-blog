# Tech Blog Backend API

## Base URL

```
http://localhost:3000/api
```

## Authentication

Most protected routes require a Bearer token in the Authorization header:

```
Authorization: Bearer <your_jwt_token>
```

---

## 🔐 Auth Routes `/api/auth`

### Register

```
POST /api/auth/register
```

**Body:**

```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "yourpassword"
}
```

**Response:**

```json
{
  "success": true,
  "data": {
    "token": "jwt_token_here",
    "user": { "id": "...", "email": "...", "role": "USER" }
  }
}
```

---

### Login

```
POST /api/auth/login
```

**Body:**

```json
{
  "email": "john@example.com",
  "password": "yourpassword"
}
```

**Response:**

```json
{
  "success": true,
  "data": {
    "token": "jwt_token_here",
    "user": { "id": "...", "email": "...", "role": "USER" }
  }
}
```

---

### Logout

```
POST /api/auth/logout
```

🔒 **Requires:** Auth token  
**Response:**

```json
{
  "status": "success",
  "message": "Logged out successfully"
}
```

---

## 📝 Post Routes `/api/posts`

### Get All Posts (Public)

```
GET /api/posts
```

**Query Params (all optional):**
| Param | Type | Description |
|------------|--------|--------------------------------------|
| `category` | string | Filter by category slug (e.g. `devops`) |
| `status` | string | `DRAFT`, `SCHEDULED`, or `PUBLISHED` |
| `search` | string | Search by title (case-insensitive) |
| `page` | number | Page number (default: 1) |
| `limit` | number | Items per page (default: 10) |

**Example:** `GET /api/posts?category=devops&status=PUBLISHED&page=1&limit=5`

**Response:**

```json
{
  "success": true,
  "data": {
    "posts": [...],
    "total": 100,
    "page": 1,
    "limit": 5
  }
}
```

---

### Get Single Post (Public)

```
GET /api/posts/:id
```

**Response:**

```json
{
  "success": true,
  "data": {
    "id": "...",
    "title": "...",
    "slug": "...",
    "shortDesc": "...",
    "content": "...",
    "thumbnailUrl": "...",
    "source": "...",
    "status": "PUBLISHED",
    "scheduledAt": null,
    "publishedAt": "2025-01-01T00:00:00Z",
    "category": { "id": "...", "name": "DevOps", "slug": "devops" }
  }
}
```

---

### Create Post

```
POST /api/posts
```

🔒 **Requires:** Auth token + Admin role  
**Body:**

```json
{
  "title": "My Post Title",
  "slug": "my-post-title",
  "shortDesc": "A short description (10-300 chars)",
  "content": "Full post content here...",
  "thumbnailUrl": "https://example.com/image.jpg",
  "source": "https://source.com",
  "status": "DRAFT",
  "scheduledAt": "2025-12-01T08:00:00Z",
  "categoryId": "category_id_here"
}
```

---

### Update Post

```
PATCH /api/posts/:id
```

🔒 **Requires:** Auth token + Admin role  
**Body:** _(all fields optional)_

```json
{
  "title": "Updated Title",
  "status": "PUBLISHED"
}
```

---

### Delete Post

```
DELETE /api/posts/:id
```

🔒 **Requires:** Auth token + Admin role  
**Response:**

```json
{
  "success": true,
  "data": { "message": "Post deleted" }
}
```

---

## 🗂️ Category Routes `/api/categories`

### Get All Categories (Public)

```
GET /api/categories
```

**Response:**

```json
{
  "success": true,
  "data": [
    {
      "id": "...",
      "name": "Web Development",
      "slug": "web-development",
      "createdAt": "...",
      "_count": { "posts": 5 }
    }
  ]
}
```

---

### Create Category

```
POST /api/categories
```

🔒 **Requires:** Auth token + Admin role  
**Body:**

```json
{
  "name": "Web Development",
  "slug": "web-development"
}
```

---

### Update Category

```
PATCH /api/categories/:id
```

🔒 **Requires:** Auth token + Admin role  
**Body:** _(at least one field required)_

```json
{
  "name": "Updated Name",
  "slug": "updated-slug"
}
```

---

### Delete Category

```
DELETE /api/categories/:id
```

🔒 **Requires:** Auth token + Admin role

---

## 👤 User Routes `/api/users`

### Get All Users

```
GET /api/users
```

🔒 **Requires:** Auth token + Admin role  
**Response:**

```json
{
  "success": true,
  "data": [
    {
      "id": "...",
      "email": "...",
      "role": "USER",
      "isDisabled": false,
      "createdAt": "...",
      "subscriptions": [...]
    }
  ]
}
```

---

### Change User Role

```
PATCH /api/users/:id/role
```

🔒 **Requires:** Auth token + Admin role  
**Body:**

```json
{
  "role": "ADMIN"
}
```

> Role must be `USER` or `ADMIN`

---

### Disable/Enable User

```
PATCH /api/users/:id/disable
```

🔒 **Requires:** Auth token + Admin role  
**Body:**

```json
{
  "isDisabled": true
}
```

---

## 📧 Subscription Routes `/api/subscription`

### Subscribe

```
POST /api/subscription
```

🔒 **Requires:** Auth token  
**Body:**

```json
{
  "email": "user@example.com",
  "topics": ["web-development", "devops"],
  "deliveryTime": "08:00"
}
```

> `topics` must match category **slugs**  
> `deliveryTime` must be in `HH:MM` format

---

### Get All Subscriptions

```
GET /api/subscription
```

🔒 **Requires:** Auth token + Admin role  
**Query Params (all optional):**
| Param | Type | Description |
|----------|--------|-----------------------------------|
| `topic` | string | Filter by topic slug |
| `status` | string | `active` or `inactive` |
| `search` | string | Search by email |

---

### Pause Subscription

```
PATCH /api/subscription/:id/pause
```

🔒 **Requires:** Auth token + Admin role  
Sets `isActive` to `false`.

---

### Delete Subscription

```
DELETE /api/subscription/:id
```

🔒 **Requires:** Auth token + Admin role

---

## 🐙 GitHub Routes `/api/github`

### Get Trending Repos (Public)

```
GET /api/github/trending
```

Returns top 10 trending GitHub repositories from the past week.  
**Response:**

```json
{
  "success": true,
  "data": [
    {
      "name": "owner/repo",
      "url": "https://github.com/owner/repo",
      "stars": 1200,
      "description": "...",
      "publishedAt": "2025-01-01T00:00:00Z"
    }
  ]
}
```

---

## 📊 Admin / Newsletter Routes `/api/admin`

### Get Dashboard Stats

```
GET /api/admin/stats
```

🔒 **Requires:** Auth token + Admin role  
**Response:**

```json
{
  "success": true,
  "data": {
    "total": 50,
    "draft": 10,
    "scheduled": 5,
    "published": 35,
    "totalSubs": 200,
    "activeSubs": 180
  }
}
```

---

### Get Newsletter History

```
GET /api/admin/newsletter/history
```

🔒 **Requires:** Auth token + Admin role  
**Response:**

```json
{
  "success": true,
  "data": [
    {
      "id": "...",
      "topics": ["web-development"],
      "totalSent": 120,
      "status": "Success",
      "sentAt": "2025-01-01T08:00:00Z"
    }
  ]
}
```

---

### Send Newsletter Manually

```
POST /api/admin/newsletter/send
```

🔒 **Requires:** Auth token + Admin role  
**Body:**

```json
{
  "topics": ["web-development", "devops"]
}
```

> Sends the latest published posts matching the given category **slugs** to all active subscribers of those topics.

**Response:**

```json
{
  "success": true,
  "data": {
    "message": "Sent to 45 subscribers",
    "postsFound": 10
  }
}
```

---

## ⚠️ Error Response Format

All errors follow this format:

```json
{
  "success": false,
  "message": "Error description here"
}
```

| Status Code | Meaning                              |
| ----------- | ------------------------------------ |
| `400`       | Bad request / Validation error       |
| `401`       | Unauthorized (missing/invalid token) |
| `403`       | Forbidden (not admin)                |
| `404`       | Resource not found                   |
| `500`       | Internal server error                |

---
