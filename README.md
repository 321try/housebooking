# House/BnB Booking System

A full-stack web application for booking houses and bed & breakfasts, built with Django REST Framework and Next.js 14.

## 🚀 Tech Stack

### Backend
- **Django 5.0** + **Django REST Framework**
- **PostgreSQL** database
- **JWT Authentication** (djangorestframework-simplejwt)
- **Cloudinary** for image uploads
- **CORS** enabled for frontend communication

### Frontend
- **Next.js 14** with App Router
- **TypeScript** for type safety
- **Tailwind CSS** for styling
- **Framer Motion** for animations
- **Zustand** for state management
- **Axios** for API calls

## ✨ Features

### Public Features
- 🏠 Browse houses and BnBs with advanced filtering
- 🔍 Search by location, type, and price
- 📸 Image galleries for properties
- 📅 Check availability and make bookings
- 👤 Guest bookings (without registration)

### User Features
- 🔐 User registration and authentication
- 📋 View booking history
- 🔔 Booking status tracking
- 👤 Profile management

### Admin Features
- 🎛️ Complete dashboard with statistics
- 🏘️ Location & sublocation management
- 🏠 House CRUD operations with image uploads
- 📊 Booking management (confirm, postpone, cancel, complete)
- 📈 Revenue tracking

## 📁 Project Structure

```
housebooking/
├── backend/                 # Django REST API
│   ├── config/             # Project settings
│   ├── apps/
│   │   ├── users/          # User authentication & management
│   │   ├── locations/      # Location & sublocation models
│   │   ├── houses/         # House listings & images
│   │   └── bookings/       # Booking system
│   ├── requirements.txt
│   └── manage.py
│
└── frontend/                # Next.js application
    ├── app/                # App router pages
    ├── components/         # React components
    ├── lib/               # API client & utilities
    ├── types/             # TypeScript definitions
    └── package.json
```

## 🛠️ Installation & Setup

### Prerequisites
- Python 3.10+
- Node.js 18+
- MySQL 8.0+
- Cloudinary account (for image uploads)

### Backend Setup

1. **Navigate to backend directory**
   ```bash
   cd backend
   ```

2. **Create virtual environment**
   ```bash
   python -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   ```

3. **Install dependencies**
   ```bash
   pip install -r requirements.txt
   ```

4. **Setup environment variables**
   ```bash
   cp .env.example .env
   # Edit .env with your database and Cloudinary credentials
   ```

5. **Create MySQL database**
   ```bash
   mysql -u root -p -e "CREATE DATABASE housebooking_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;"
   ```

6. **Run migrations**
   ```bash
   python manage.py makemigrations
   python manage.py migrate
   ```

7. **Create superuser**
   ```bash
   python manage.py createsuperuser
   ```

8. **Run server**
   ```bash
   python manage.py runserver
   ```

Backend will be available at `http://localhost:8000`

### Frontend Setup

1. **Navigate to frontend directory**
   ```bash
   cd frontend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Setup environment**
   ```bash
   cp .env.example .env.local
   # Update NEXT_PUBLIC_API_URL if needed
   ```

4. **Run development server**
   ```bash
   npm run dev
   ```

Frontend will be available at `http://localhost:3000`

## 📡 API Endpoints

### Authentication
- `POST /api/auth/register/` - Register new user
- `POST /api/auth/login/` - Login
- `POST /api/auth/logout/` - Logout
- `GET /api/auth/me/` - Get current user
- `POST /api/auth/token/refresh/` - Refresh JWT token

### Locations
- `GET /api/locations/` - List locations
- `POST /api/locations/` - Create location (Admin)
- `GET /api/locations/:id/` - Location detail
- `PUT /api/locations/:id/` - Update location (Admin)
- `DELETE /api/locations/:id/` - Delete location (Admin)

### Houses
- `GET /api/houses/` - List houses (filterable)
- `POST /api/houses/` - Create house (Admin)
- `GET /api/houses/:id/` - House detail
- `PUT /api/houses/:id/` - Update house (Admin)
- `DELETE /api/houses/:id/` - Delete house (Admin)
- `PATCH /api/houses/:id/status/` - Update status (Admin)
- `POST /api/houses/:id/images/` - Upload image (Admin)

### Bookings
- `GET /api/bookings/` - List all bookings (Admin)
- `POST /api/bookings/` - Create booking (Public)
- `GET /api/bookings/my/` - User's bookings (User)
- `GET /api/bookings/:id/` - Booking detail
- `PATCH /api/bookings/:id/status/` - Update status (Admin)

## 🎨 UI Design

- **Theme:** Dark mode with warm amber/terracotta accents
- **Layout:** Card-based design with smooth transitions
- **Typography:** Inter font family
- **Mobile:** Fully responsive across all devices

## 🔒 Security Features

- JWT-based authentication
- Token refresh mechanism
- Role-based access control (Admin/User)
- CORS configuration
- Password validation
- SQL injection protection (Django ORM)

## 📋 Development Phases

### ✅ Phase 1 - Foundation (COMPLETED)
- [x] Django project setup + PostgreSQL
- [x] Custom User model with roles
- [x] JWT authentication endpoints
- [x] Next.js setup + Tailwind CSS
- [x] Auth context + protected routes

### 🚧 Phase 2 - Core Admin Features (IN PROGRESS)
- [ ] Location & SubLocation CRUD
- [ ] House CRUD with image upload
- [ ] House status management
- [ ] Admin dashboard with stats

### 📝 Phase 3 - Public & User Features (PLANNED)
- [ ] Public house listings with filters
- [ ] House detail page
- [ ] Booking form (guest + logged-in flows)
- [ ] User dashboard with history

### 📝 Phase 4 - Booking Management (PLANNED)
- [ ] Admin booking table with filters
- [ ] Booking status actions
- [ ] Auto-update house availability
- [ ] Booking confirmation system

### 📝 Phase 5 - UI Polish (PLANNED)
- [ ] Framer Motion page transitions
- [ ] Image gallery/carousel
- [ ] Skeleton loaders
- [ ] Mobile responsive layouts
- [ ] Toast notifications

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Open a pull request

## 📝 License

This project is for educational/portfolio purposes.

## 📧 Contact

For questions or feedback, please open an issue in the repository.

---

**Happy Coding! 🎉**
# housebooking
