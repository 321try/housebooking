# House/BnB Booking System - Project Structure

## Complete Directory Tree

```
housebooking/
│
├── README.md                    # Main project documentation
├── .gitignore                   # Git ignore rules
├── setup.sh                     # Setup script (Unix/Linux/Mac)
├── setup.bat                    # Setup script (Windows)
│
├── backend/                     # Django REST API
│   ├── manage.py               # Django management script
│   ├── requirements.txt        # Python dependencies
│   ├── .env.example           # Environment variables template
│   ├── .gitignore             # Backend-specific ignores
│   ├── README.md              # Backend documentation
│   │
│   ├── config/                 # Django project configuration
│   │   ├── __init__.py
│   │   ├── settings.py        # Main settings file
│   │   ├── urls.py            # Root URL configuration
│   │   ├── asgi.py            # ASGI config
│   │   └── wsgi.py            # WSGI config
│   │
│   └── apps/                   # Django applications
│       ├── __init__.py
│       │
│       ├── users/              # User authentication & management
│       │   ├── __init__.py
│       │   ├── admin.py       # Django admin config
│       │   ├── apps.py        # App configuration
│       │   ├── models.py      # Custom User model
│       │   ├── serializers.py # DRF serializers
│       │   ├── views.py       # API views
│       │   ├── urls.py        # URL routing
│       │   └── permissions.py # Custom permissions
│       │
│       ├── locations/          # Locations & sublocations
│       │   ├── __init__.py
│       │   ├── admin.py
│       │   ├── apps.py
│       │   ├── models.py      # Location & SubLocation models
│       │   ├── serializers.py
│       │   ├── views.py
│       │   └── urls.py
│       │
│       ├── houses/             # House listings & images
│       │   ├── __init__.py
│       │   ├── admin.py
│       │   ├── apps.py
│       │   ├── models.py      # House & HouseImage models
│       │   ├── serializers.py
│       │   ├── views.py       # CRUD + image upload
│       │   └── urls.py
│       │
│       └── bookings/           # Booking system
│           ├── __init__.py
│           ├── admin.py
│           ├── apps.py
│           ├── models.py      # Booking model
│           ├── serializers.py
│           ├── views.py       # Booking management
│           └── urls.py
│
└── frontend/                    # Next.js 14 Application
    ├── package.json            # Node dependencies
    ├── next.config.js          # Next.js configuration
    ├── tsconfig.json           # TypeScript configuration
    ├── tailwind.config.js      # Tailwind CSS config
    ├── postcss.config.js       # PostCSS config
    ├── .eslintrc.json         # ESLint configuration
    ├── .env.example           # Environment template
    ├── .env.local             # Environment variables
    ├── .gitignore             # Frontend-specific ignores
    ├── README.md              # Frontend documentation
    │
    ├── app/                    # Next.js App Router
    │   ├── layout.tsx         # Root layout with Navbar
    │   ├── page.tsx           # Home page with Hero
    │   ├── globals.css        # Global styles
    │   ├── loading.tsx        # Loading state
    │   ├── not-found.tsx      # 404 page
    │   │
    │   ├── login/             # Authentication
    │   │   └── page.tsx       # Login page
    │   │
    │   ├── register/
    │   │   └── page.tsx       # Registration page
    │   │
    │   ├── houses/            # House browsing
    │   │   ├── page.tsx       # Houses listing with filters
    │   │   └── [id]/          # Dynamic routes
    │   │       └── page.tsx   # House detail page (TODO)
    │   │
    │   ├── dashboard/         # User dashboard (TODO)
    │   │   └── page.tsx
    │   │
    │   └── admin/             # Admin panel (TODO)
    │       └── page.tsx
    │
    ├── components/             # React components
    │   ├── Navbar.tsx         # Navigation bar
    │   ├── Hero.tsx           # Hero section
    │   ├── FeaturedHouses.tsx # Featured properties
    │   ├── ProtectedRoute.tsx # Auth guard
    │   │
    │   ├── ui/                # Reusable UI components (TODO)
    │   ├── admin/             # Admin components (TODO)
    │   ├── booking/           # Booking components (TODO)
    │   └── house/             # House components (TODO)
    │
    ├── lib/                    # Utilities & helpers
    │   ├── api-client.ts      # Axios instance with interceptors
    │   ├── api.ts             # API endpoint functions
    │   ├── auth-store.ts      # Zustand auth store
    │   └── utils.ts           # Helper functions
    │
    └── types/                  # TypeScript definitions
        └── index.ts           # All type definitions
```

## Key Files by Purpose

### Authentication Flow
- `backend/apps/users/models.py` - Custom User model
- `backend/apps/users/views.py` - Login, register, logout endpoints
- `frontend/lib/auth-store.ts` - Client-side auth state management
- `frontend/app/login/page.tsx` - Login UI
- `frontend/app/register/page.tsx` - Registration UI

### API Layer
- `backend/config/urls.py` - Main API routing
- `backend/apps/*/urls.py` - App-specific routes
- `frontend/lib/api-client.ts` - HTTP client with JWT handling
- `frontend/lib/api.ts` - API endpoint wrappers

### Data Models
- `backend/apps/users/models.py` - User (email-based auth, roles)
- `backend/apps/locations/models.py` - Location & SubLocation
- `backend/apps/houses/models.py` - House & HouseImage
- `backend/apps/bookings/models.py` - Booking with auto-generated codes

### UI Components
- `frontend/components/Navbar.tsx` - Navigation with auth state
- `frontend/components/Hero.tsx` - Landing page hero
- `frontend/components/FeaturedHouses.tsx` - Property cards
- `frontend/components/ProtectedRoute.tsx` - Route protection

## Database Schema

### Users
- id, email (unique), name, phone_number
- role (ADMIN | USER), is_guest
- Standard Django auth fields

### Locations
- id, name, description
- created_by → User

### SubLocations
- id, name, description
- location → Location

### Houses
- id, name, description, price
- type (HOUSE | BNB), status (AVAILABLE | BOOKED | etc.)
- location → Location, sublocation → SubLocation
- amenities (JSON), availability dates
- created_by → User

### HouseImages
- id, image_url (Cloudinary), is_primary
- house → House

### Bookings
- id, booking_code (auto-generated)
- house → House, user → User (nullable)
- guest_name, guest_phone (for non-logged users)
- check_in, check_out, status, notes
- managed_by → User

## API Endpoints Summary

### Auth: `/api/auth/`
- POST `register/` - Create account
- POST `login/` - Get JWT tokens
- POST `logout/` - Invalidate tokens
- GET `me/` - Current user info
- POST `token/refresh/` - Refresh access token

### Locations: `/api/locations/`
- GET, POST `/` - List/create locations
- GET, PUT, DELETE `/:id/` - Manage location
- GET `/:id/sublocations/` - Location's sublocations
- GET, POST `/api/sublocations/` - All sublocations

### Houses: `/api/houses/`
- GET, POST `/` - List/create (with filters)
- GET, PUT, DELETE `/:id/` - Manage house
- PATCH `/:id/status/` - Update status
- POST `/:id/images/` - Upload image

### Bookings: `/api/bookings/`
- GET, POST `/` - Admin: all | Public: create
- GET `/my/` - User's bookings
- GET `/:id/` - Booking detail
- PATCH `/:id/status/` - Update status

## Tech Stack Details

### Backend
- Python 3.10+
- Django 5.0 + DRF 3.14
- PostgreSQL 14+
- JWT (simplejwt)
- Cloudinary for media
- django-filter for query filtering
- django-cors-headers for CORS

### Frontend
- Node.js 18+
- Next.js 14 (App Router)
- TypeScript 5
- Tailwind CSS 3
- Framer Motion (animations)
- Zustand (state management)
- Axios (HTTP client)
- Lucide React (icons)

## Development Status

✅ **Phase 1 - Foundation (COMPLETED)**
- Django project structure
- Custom User model with roles
- JWT authentication
- All data models (User, Location, House, Booking)
- Complete REST API with permissions
- Next.js 14 setup with App Router
- Tailwind CSS configuration
- Auth context and API client
- Protected routes
- Login/Register pages
- Home page with hero
- Houses listing page with filters

🚧 **Phase 2 - Core Admin Features (NEXT)**
- Admin dashboard
- Location/SubLocation management UI
- House management UI with image uploads
- House status management

📋 **Phase 3 - Public & User Features (PLANNED)**
- House detail page
- Booking form
- User dashboard
- Booking history

📋 **Phase 4 - Booking Management (PLANNED)**
- Admin booking table
- Booking status actions
- House availability automation

📋 **Phase 5 - UI Polish (PLANNED)**
- Enhanced animations
- Image galleries
- Loading states
- Toast notifications
- Mobile optimization
