# House Booking Backend

Django REST API for a house/BnB booking system.

## Setup

### 1. Create virtual environment
```bash
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
```

### 2. Install dependencies
```bash
pip install -r requirements.txt
```

### 3. Environment configuration
Copy `.env.example` to `.env` and update with your credentials:
```bash
cp .env.example .env
```

### 4. Create MySQL database
```bash
mysql -u root -p -e "CREATE DATABASE housebooking_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;"
```

### 5. Run migrations
```bash
python manage.py makemigrations
python manage.py migrate
```

### 6. Create superuser
```bash
python manage.py createsuperuser
```

### 7. Run development server
```bash
python manage.py runserver
```

The API will be available at `http://localhost:8000`

## API Endpoints

### Authentication
- `POST /api/auth/register/` - Register new user
- `POST /api/auth/login/` - Login user
- `POST /api/auth/logout/` - Logout user
- `GET /api/auth/me/` - Get current user
- `POST /api/auth/token/refresh/` - Refresh JWT token

### Locations
- `GET /api/locations/` - List all locations
- `POST /api/locations/` - Create location (Admin)
- `GET /api/locations/:id/` - Get location detail
- `PUT /api/locations/:id/` - Update location (Admin)
- `DELETE /api/locations/:id/` - Delete location (Admin)
- `GET /api/locations/:id/sublocations/` - List sublocations
- `GET /api/sublocations/` - List all sublocations
- `POST /api/sublocations/` - Create sublocation (Admin)

### Houses
- `GET /api/houses/` - List all houses (with filters)
- `POST /api/houses/` - Create house (Admin)
- `GET /api/houses/:id/` - Get house detail
- `PUT /api/houses/:id/` - Update house (Admin)
- `DELETE /api/houses/:id/` - Delete house (Admin)
- `PATCH /api/houses/:id/status/` - Update house status (Admin)
- `POST /api/houses/:id/images/` - Upload house image (Admin)

### Bookings
- `GET /api/bookings/` - List all bookings (Admin)
- `POST /api/bookings/` - Create booking (Public)
- `GET /api/bookings/my/` - Get user's bookings (User)
- `GET /api/bookings/:id/` - Get booking detail (Owner/Admin)
- `PATCH /api/bookings/:id/status/` - Update booking status (Admin)

## Admin Panel

Access the Django admin at `http://localhost:8000/admin/`
