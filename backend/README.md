# INFO CLUB HUB - Backend API

Node.js/Express backend for the INFO CLUB HUB website.

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- PostgreSQL 14+

### Installation

```bash
cd backend

# Install dependencies
npm install

# Copy environment variables
cp .env.example .env

# Edit .env with your database credentials
```

### Database Setup

```bash
# Create database
psql -U postgres -c "CREATE DATABASE info_club_hub;"

# Run migrations
npm run db:migrate

# Seed sample data (optional)
npm run db:seed
```

### Run the Server

```bash
# Development (with hot reload)
npm run dev

# Production
npm start
```

Server runs on `http://localhost:3001`

---

## 📚 API Endpoints

### Authentication
| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| POST | `/api/auth/signup` | Register new user | - |
| POST | `/api/auth/signin` | Login | - |
| GET | `/api/auth/me` | Get current user | ✅ |
| PATCH | `/api/auth/profile` | Update profile | ✅ |
| POST | `/api/auth/change-password` | Change password | ✅ |

### Events
| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| GET | `/api/events` | List events | - |
| GET | `/api/events/:id` | Get event | - |
| POST | `/api/events` | Create event | Admin |
| PATCH | `/api/events/:id` | Update event | Admin |
| DELETE | `/api/events/:id` | Delete event | Admin |
| GET | `/api/events/:id/photos` | Get event photos | - |
| POST | `/api/events/:id/photos` | Add event photo | Admin |

### Projects
| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| GET | `/api/projects` | List projects | - |
| GET | `/api/projects/:id` | Get project | - |
| POST | `/api/projects` | Create project | Admin |
| PATCH | `/api/projects/:id` | Update project | Admin |
| DELETE | `/api/projects/:id` | Delete project | Admin |

### Team Members
| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| GET | `/api/team` | List members | - |
| GET | `/api/team/:id` | Get member | - |
| POST | `/api/team` | Create member | Admin |
| PATCH | `/api/team/:id` | Update member | Admin |
| DELETE | `/api/team/:id` | Delete member | Admin |
| POST | `/api/team/reorder` | Reorder members | Admin |

### Gallery
| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| GET | `/api/gallery` | List photos | - |
| GET | `/api/gallery/categories` | Get categories | - |
| POST | `/api/gallery` | Upload photo | Admin |
| DELETE | `/api/gallery/:id` | Delete photo | Admin |

### Contact Submissions
| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| POST | `/api/contact` | Submit form | - |
| GET | `/api/contact` | List submissions | Admin |
| PATCH | `/api/contact/:id` | Mark read/unread | Admin |
| DELETE | `/api/contact/:id` | Delete | Admin |

### Join Applications
| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| POST | `/api/applications` | Submit application | - |
| GET | `/api/applications` | List applications | Admin |
| PATCH | `/api/applications/:id` | Mark reviewed | Admin |
| DELETE | `/api/applications/:id` | Delete | Admin |

### File Uploads
| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| POST | `/api/upload` | Upload single file | Admin |
| POST | `/api/upload/multiple` | Upload multiple | Admin |
| DELETE | `/api/upload/:filename` | Delete file | Admin |

### Stats
| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| GET | `/api/stats` | Admin dashboard stats | Admin |
| GET | `/api/stats/public` | Public homepage stats | - |

---

## 🔐 Authentication

Include JWT token in Authorization header:
```
Authorization: Bearer <token>
```

---

## 📦 Project Structure

```
backend/
├── src/
│   ├── config/
│   │   └── database.js      # PostgreSQL connection
│   ├── db/
│   │   ├── migrate.js       # Database migrations
│   │   └── seed.js          # Sample data seeder
│   ├── middleware/
│   │   └── auth.js          # JWT authentication
│   ├── routes/
│   │   ├── auth.js          # Auth endpoints
│   │   ├── events.js        # Events CRUD
│   │   ├── projects.js      # Projects CRUD
│   │   ├── team.js          # Team members CRUD
│   │   ├── gallery.js       # Gallery CRUD
│   │   ├── contact.js       # Contact submissions
│   │   ├── applications.js  # Join applications
│   │   ├── upload.js        # File uploads
│   │   └── stats.js         # Dashboard stats
│   ├── utils/
│   │   └── upload.js        # Multer configuration
│   └── index.js             # Express app entry
├── uploads/                  # Uploaded files
├── .env.example
├── package.json
└── README.md
```

---

## 🧪 Default Admin

After seeding:
- Email: `admin@infoclub.com`
- Password: `admin123`

---

## 🔧 Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `DATABASE_URL` | PostgreSQL connection string | - |
| `JWT_SECRET` | Secret for JWT signing | - |
| `JWT_EXPIRES_IN` | Token expiration | `7d` |
| `PORT` | Server port | `3001` |
| `FRONTEND_URL` | CORS origin | `http://localhost:5173` |
| `MAX_FILE_SIZE` | Max upload size (bytes) | `5242880` |
