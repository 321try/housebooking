#!/bin/bash

# Colors for output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

echo -e "${GREEN}=== House Booking System - Development Setup ===${NC}\n"

# Check Python
if ! command -v python3 &> /dev/null; then
    echo -e "${RED}Python 3 is not installed. Please install Python 3.10 or higher.${NC}"
    exit 1
fi

# Check Node.js
if ! command -v node &> /dev/null; then
    echo -e "${RED}Node.js is not installed. Please install Node.js 18 or higher.${NC}"
    exit 1
fi

# Check PostgreSQL
if ! command -v psql &> /dev/null; then
    echo -e "${YELLOW}PostgreSQL is not installed. Please install PostgreSQL 14 or higher.${NC}"
fi

echo -e "${GREEN}✓ Prerequisites check passed${NC}\n"

# Backend Setup
echo -e "${YELLOW}Setting up backend...${NC}"
cd backend

# Create virtual environment
if [ ! -d "venv" ]; then
    python3 -m venv venv
    echo -e "${GREEN}✓ Virtual environment created${NC}"
fi

# Activate virtual environment
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt
echo -e "${GREEN}✓ Backend dependencies installed${NC}"

# Copy .env.example if .env doesn't exist
if [ ! -f ".env" ]; then
    cp .env.example .env
    echo -e "${YELLOW}⚠ Please update backend/.env with your database and Cloudinary credentials${NC}"
fi

echo -e "${GREEN}✓ Backend setup complete${NC}\n"

# Frontend Setup
echo -e "${YELLOW}Setting up frontend...${NC}"
cd ../frontend

# Install dependencies
npm install
echo -e "${GREEN}✓ Frontend dependencies installed${NC}"

# Copy .env.example if .env.local doesn't exist
if [ ! -f ".env.local" ]; then
    cp .env.example .env.local
    echo -e "${GREEN}✓ Frontend environment configured${NC}"
fi

echo -e "${GREEN}✓ Frontend setup complete${NC}\n"

cd ..

echo -e "${GREEN}=== Setup Complete! ===${NC}\n"
echo -e "${YELLOW}Next steps:${NC}"
echo "1. Update backend/.env with your database credentials"
echo "2. Create PostgreSQL database: createdb housebooking_db"
echo "3. Run migrations: cd backend && python manage.py migrate"
echo "4. Create superuser: python manage.py createsuperuser"
echo "5. Start backend: python manage.py runserver"
echo "6. Start frontend (in new terminal): cd frontend && npm run dev"
echo ""
echo -e "${GREEN}Happy coding! 🚀${NC}"
