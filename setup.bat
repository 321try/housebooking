@echo off
echo === House Booking System - Development Setup ===
echo.

REM Check Python
where python >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo Python is not installed. Please install Python 3.10 or higher.
    exit /b 1
)

REM Check Node.js
where node >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo Node.js is not installed. Please install Node.js 18 or higher.
    exit /b 1
)

echo Prerequisites check passed
echo.

REM Backend Setup
echo Setting up backend...
cd backend

REM Create virtual environment
if not exist "venv" (
    python -m venv venv
    echo Virtual environment created
)

REM Activate virtual environment
call venv\Scripts\activate

REM Install dependencies
pip install -r requirements.txt
echo Backend dependencies installed

REM Copy .env.example if .env doesn't exist
if not exist ".env" (
    copy .env.example .env
    echo Please update backend\.env with your database and Cloudinary credentials
)

echo Backend setup complete
echo.

REM Frontend Setup
echo Setting up frontend...
cd ..\frontend

REM Install dependencies
call npm install
echo Frontend dependencies installed

REM Copy .env.example if .env.local doesn't exist
if not exist ".env.local" (
    copy .env.example .env.local
    echo Frontend environment configured
)

echo Frontend setup complete
echo.

cd ..

echo === Setup Complete! ===
echo.
echo Next steps:
echo 1. Update backend\.env with your database credentials
echo 2. Create PostgreSQL database: createdb housebooking_db
echo 3. Run migrations: cd backend ^&^& python manage.py migrate
echo 4. Create superuser: python manage.py createsuperuser
echo 5. Start backend: python manage.py runserver
echo 6. Start frontend (in new terminal): cd frontend ^&^& npm run dev
echo.
echo Happy coding!
pause
