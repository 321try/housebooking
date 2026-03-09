# House Booking Frontend

Next.js 14 frontend for the house/BnB booking system.

## Tech Stack

- **Framework:** Next.js 14 (App Router)
- **Language:** TypeScript
- **Styling:** Tailwind CSS
- **Animations:** Framer Motion
- **State Management:** Zustand
- **HTTP Client:** Axios
- **Icons:** Lucide React

## Setup

### 1. Install dependencies
```bash
npm install
```

### 2. Environment configuration
Copy `.env.example` to `.env.local` and update:
```bash
cp .env.example .env.local
```

Make sure the `NEXT_PUBLIC_API_URL` points to your Django backend (default: `http://localhost:8000`)

### 3. Run development server
```bash
npm run dev
```

The app will be available at `http://localhost:3000`

## Project Structure

```
frontend/
├── app/                    # Next.js app directory
│   ├── (public)/          # Public routes
│   ├── admin/             # Admin panel pages
│   ├── dashboard/         # User dashboard pages
│   ├── houses/            # House listing pages
│   ├── login/             # Login page
│   ├── register/          # Registration page
│   └── layout.tsx         # Root layout
├── components/            # React components
│   ├── ui/               # Reusable UI components
│   ├── admin/            # Admin-specific components
│   ├── booking/          # Booking components
│   └── house/            # House-related components
├── lib/                   # Utility functions
│   ├── api-client.ts     # Axios instance with interceptors
│   ├── api.ts            # API functions
│   ├── auth-store.ts     # Zustand auth store
│   └── utils.ts          # Helper functions
├── types/                 # TypeScript types
└── public/               # Static assets
```

## Features

- 🎨 Modern dark theme with warm accent colors
- 🔐 JWT-based authentication
- 📱 Fully responsive design
- ✨ Smooth animations with Framer Motion
- 🏠 House browsing with filters
- 📅 Booking system
- 👤 User dashboard
- 🛠️ Admin panel
- 🖼️ Image galleries with Cloudinary

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm start` - Start production server
- `npm run lint` - Run ESLint

## API Integration

The frontend connects to the Django backend API. All API calls are made through the `apiClient` which includes:

- Automatic JWT token management
- Token refresh on 401 errors
- Request/response interceptors
- Error handling

## Authentication Flow

1. User logs in/registers
2. JWT tokens (access + refresh) are stored in localStorage
3. Access token is automatically added to all API requests
4. On token expiry (401), the refresh token is used to get a new access token
5. If refresh fails, user is redirected to login
