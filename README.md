# Streamify

A full-stack music streaming platform built with the MERN stack and TypeScript, inspired by Spotify. Stream music, browse albums, chat with friends in real time, and manage your music library — all in one place.

**Live:** [streamify.codewithxjohn.com](https://streamify.codewithxjohn.com)

---

## Features

### Music
- Browse and stream songs with a persistent audio player
- Featured, Made For You, and Trending song sections on the home page
- Album pages with full song listings and playback controls
- Play/pause, next/previous, and seek controls
- Volume control with mute toggle
- Queue management — songs automatically queued from the current section

### Admin Dashboard
- Protected admin panel (role-based via Clerk)
- Upload songs with audio file, cover image, title, artist, duration, and optional album
- Create and delete albums
- Delete songs
- Stats overview: total songs, albums, artists, and users

### Real-Time Chat
- See which friends are online
- View what song each friend is currently listening to
- Send and receive messages in real time via Socket.io

### Auth
- Sign in / sign up via Clerk (OAuth supported)
- Auth-callback page handles redirect after login

---

## Tech Stack

### Frontend
| Technology | Purpose |
|---|---|
| React 19 + TypeScript | UI framework |
| Vite | Build tool & dev server |
| Tailwind CSS + shadcn/ui | Styling and components |
| Zustand | Global state management |
| Axios | HTTP client |
| Socket.io-client | Real-time messaging |
| Clerk (clerk-react) | Authentication |
| React Router v7 | Client-side routing |
| Radix UI | Accessible component primitives |
| Lucide React | Icons |
| react-hot-toast | Notifications |

### Backend
| Technology | Purpose |
|---|---|
| Node.js + Express | API server |
| MongoDB + Mongoose | Database |
| Clerk (clerk-express) | Auth middleware |
| Socket.io | Real-time events |
| Cloudinary | Audio and image file storage |
| express-fileupload | Multipart file handling |
| node-cron | Scheduled temp file cleanup |
| dotenv | Environment config |

### Infrastructure
| Technology | Purpose |
|---|---|
| Docker | Containerised builds |
| Kubernetes (K8s) | Container orchestration |
| Traefik | Ingress controller |
| cert-manager + Let's Encrypt | Automatic TLS |
| GitHub Actions | CI/CD pipeline |
| Docker Hub | Image registry |

---

## Project Structure

```
.
├── backend/
│   ├── Dockerfile
│   ├── src/
│   │   ├── index.js          # Express app entry point
│   │   ├── db.js             # MongoDB connection
│   │   ├── socket.io.js      # Socket.io server setup
│   │   ├── cloudinary.js     # Cloudinary config
│   │   ├── controllers/      # Route handlers
│   │   ├── middlewares/      # Auth middleware
│   │   ├── models/           # Mongoose models
│   │   ├── routes/           # Express routers
│   │   └── seeds/            # DB seed scripts
├── frontend/
│   ├── Dockerfile
│   ├── nginx.conf
│   ├── src/
│   │   ├── main.tsx          # App entry point + Clerk provider
│   │   ├── App.tsx           # Route definitions
│   │   ├── components/       # Shared UI components
│   │   ├── layout/           # Main layout, sidebar, audio player
│   │   ├── lib/              # Axios instance
│   │   ├── pages/            # Route pages (home, album, admin, chat, auth)
│   │   ├── providers/        # AuthProvider
│   │   ├── stores/           # Zustand stores
│   │   └── types/            # TypeScript interfaces
├── kubernetes/               # K8s manifests
└── .github/workflows/        # GitHub Actions CI/CD
```

---

## Getting Started

### Prerequisites
- Node.js 20+
- MongoDB Atlas cluster
- Clerk account
- Cloudinary account

### Backend

```bash
cd backend
cp .env.example .env   # fill in values (see below)
npm install
npm run dev
```

**Backend `.env`**
```env
NODE_ENV=development
PORT=5000
CLIENT_URL=http://localhost:5173
ADMIN_EMAIL=your@email.com
MONGODB_URI=mongodb+srv://<user>:<pass>@cluster.mongodb.net/Spotify-Clone
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
CLERK_SECRET_KEY=sk_test_...
CLERK_PUBLISHABLE_KEY=pk_test_...
```

### Frontend

```bash
cd frontend
cp .env.example .env   # fill in values (see below)
npm install
npm run dev
```

**Frontend `.env`**
```env
VITE_CLERK_PUBLISHABLE_KEY=pk_test_...
VITE_BACKEND_URL=http://localhost:5000
```

### Seed the Database

```bash
cd backend
npm run seed:songs
npm run seed:albums
```

---

## API Overview

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/api/health` | None | Health check |
| GET | `/api/songs` | Admin | All songs |
| GET | `/api/songs/featured` | None | 6 random songs |
| GET | `/api/songs/made-for-you` | None | 4 random songs |
| GET | `/api/songs/trending` | None | 4 random songs |
| GET | `/api/albums` | None | All albums |
| GET | `/api/albums/:id` | None | Album + songs |
| GET | `/api/users` | Auth | All users except self |
| GET | `/api/users/messages/:userId` | Auth | Conversation history |
| GET | `/api/stats` | Admin | Platform stats |
| POST | `/api/admin/songs` | Admin | Upload song |
| DELETE | `/api/admin/songs/:id` | Admin | Delete song |
| POST | `/api/admin/albums` | Admin | Create album |
| DELETE | `/api/admin/albums/:id` | Admin | Delete album |

---

## Deployment

The app is deployed on Kubernetes with automatic TLS via cert-manager.

- Frontend: served via Nginx on port 8080, exposed at `streamify.codewithxjohn.com`
- Backend: Node.js on port 5000, exposed at `api.streamify.codewithxjohn.com`

### CI/CD (GitHub Actions)

On every push to `main`:
1. Trivy scans the repo for vulnerabilities
2. Docker images are built and pushed to Docker Hub
3. Kubernetes secrets are updated from GitHub secrets
4. Deployments are rolled out with the new image tag
5. Rollout status is verified

### Required GitHub Secrets

| Secret | Description |
|--------|-------------|
| `DOCKERHUB_USERNAME` | Docker Hub username |
| `DOCKERHUB_TOKEN` | Docker Hub access token |
| `KUBECONFIG` | Base64-encoded kubeconfig |
| `MONGODB_URI` | MongoDB Atlas connection string |
| `ADMIN_EMAIL` | Admin user email |
| `CLOUDINARY_CLOUD_NAME` | Cloudinary cloud name |
| `CLOUDINARY_API_KEY` | Cloudinary API key |
| `CLOUDINARY_API_SECRET` | Cloudinary API secret |
| `CLERK_SECRET_KEY` | Clerk backend secret key |
| `CLERK_PUBLISHABLE_KEY` | Clerk publishable key (also used as `VITE_CLERK_PUBLISHABLE_KEY` at build time) |

---

## License

ISC
