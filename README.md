# KAZI CONNECT

A comprehensive job platform connecting workers with employers, powered by AI-driven matching and real-time communication.

## Table of Contents
- [Features](#features)
- [Architecture](#architecture)
- [Tech Stack](#tech-stack)
- [Installation](#installation)
- [Configuration](#configuration)
- [API Documentation](#api-documentation)
- [Testing](#testing)
- [Deployment](#deployment)
- [Contributing](#contributing)
- [License](#license)

## Features

### Core Functionality
- **Multi-Role System**: Admin, Worker, and Employer roles with dedicated dashboards
- **AI-Powered Matching**: Intelligent job-worker matching based on skills, location, and ratings
- **Real-Time Messaging**: Socket.io powered instant communication between users
- **Secure Authentication**: JWT-based auth with OTP verification
- **Job Management**: Complete job lifecycle from posting to completion
- **Payment Integration**: Secure payment processing and tracking
- **Review System**: Two-way rating system for quality assurance
- **Dispute Resolution**: Admin-managed dispute handling

### Technical Features
- **RESTful API**: Well documented API endpoints
- **Responsive Design**: Mobile friendly interface using Tailwind CSS
- **Real-Time Updates**: Live notifications and messaging
- **File Uploads**: Support for document and image uploads
- **Rate Limiting**: Protection against API abuse
- **Input Validation**: Comprehensive request validation
- **Error Handling**: Centralized error management

## Architecture

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Frontend     │    │    Backend      │    │   AI Service    │
│   (React)      │◄──►│   (Node.js)     │◄──►│   (Python)      │
│                │    │                │    │                │
│ - User Interface│    │ - REST API      │    │ - ML Matching   │
│ - State Mgmt   │    │ - Auth          │    │ - Scoring       │
│ - Routing      │    │ - Socket.io     │    │                │
└─────────────────┘    └─────────────────┘    └─────────────────┘
         │                       │                       │
         └───────────────────────┼───────────────────────┘
                                 │
                    ┌─────────────────┐
                    │   Database      │
                    │  (PostgreSQL)   │
                    │                │
                    │ - Users        │
                    │ - Jobs         │
                    │ - Applications │
                    │ - Messages     │
                    └─────────────────┘
```

## Tech Stack

### Frontend
- **React 19** - UI framework
- **React Router** - Client-side routing
- **Tailwind CSS** - Styling
- **Axios** - HTTP client
- **Socket.io Client** - Real-time communication
- **Lucide React** - Icons

### Backend
- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **Sequelize** - ORM for PostgreSQL
- **Socket.io** - Real-time communication
- **JWT** - Authentication
- **Bcrypt** - Password hashing
- **Express Validator** - Input validation

### AI Service
- **Python 3.11** - Runtime
- **FastAPI** - Web framework
- **Scikit-learn** - Machine learning
- **Pandas** - Data processing

### Database
- **PostgreSQL** - Primary database
- **Redis** - Caching and sessions

### Deployment
- **Docker** - Containerization
- **Nginx** - Reverse proxy and load balancing
- **Docker Compose** - Multi-container orchestration

## Prerequisites

- Node.js 18+
- Python 3.11+
- PostgreSQL 15+
- Redis 7+
- Docker & Docker Compose (for containerized deployment)

## Quick Start

### Local Development

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd kazi-connect
   ```

2. **Backend Setup**
   ```bash
   cd backend
   npm install
   cp .env.example .env
   # Edit .env with your database credentials
   npm run dev
   ```

3. **Frontend Setup**
   ```bash
   cd frontend
   npm install
   cp .env.example .env
   npm run dev
   ```

4. **AI Service Setup**
   ```bash
   cd ai_service
   python -m venv .venv
   source .venv/bin/activate  # On Windows: .venv\Scripts\activate
   pip install -r requirements.txt
   python main.py
   ```

### Docker Deployment

1. **Environment Configuration**
   ```bash
   cp backend/.env.example backend/.env
   # Configure production values
   ```

2. **Build and Run**
   ```bash
   docker-compose up -d
   ```

## Project Structure

```
kazi-connect/
├── backend/                 # Node.js API server
│   ├── config/             # Database configuration
│   ├── controllers/        # Route controllers
│   ├── middleware/         # Custom middleware
│   ├── models/            # Database models
│   ├── routes/            # API routes
│   ├── services/          # Business logic
│   └── uploads/           # File uploads
├── frontend/               # React application
│   ├── src/
│   │   ├── components/    # Reusable components
│   │   ├── context/       # React context
│   │   ├── layouts/       # Page layouts
│   │   ├── pages/         # Page components
│   │   └── api/          # API utilities
├── ai_service/            # Python AI service
│   ├── main.py           # FastAPI application
│   └── requirements.txt  # Python dependencies
├── nginx.conf            # Nginx configuration
├── docker-compose.yml    # Docker orchestration
└── Dockerfile           # Container configuration
```

## Security Features

- **JWT Authentication**: Secure token-based authentication
- **Password Hashing**: Bcrypt for password security
- **Input Validation**: Comprehensive request validation
- **Rate Limiting**: Protection against API abuse
- **CORS Configuration**: Proper cross-origin resource sharing
- **SQL Injection Prevention**: ORM-based database queries
- **XSS Protection**: Input sanitization and output encoding

## API Documentation

### Authentication Endpoints
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `POST /api/auth/verify-otp` - OTP verification

### Job Endpoints
- `GET /api/jobs` - Get all jobs
- `POST /api/jobs` - Create new job (Employer only)
- `GET /api/jobs/:id` - Get job details
- `POST /api/jobs/:id/apply` - Apply for job (Worker only)

### User Endpoints
- `GET /api/users/profile` - Get user profile
- `PUT /api/users/profile` - Update profile
- `GET /api/users/stats` - Get user statistics

## Testing

```bash
# Backend tests
cd backend
npm test

# Frontend tests
cd frontend
npm test

# AI Service tests
cd ai_service
python -m pytest
```

## Performance Optimizations

- **Database Indexing**: Optimized queries with proper indexes
- **Code Splitting**: Frontend bundle optimization
- **Image Optimization**: Compressed static assets
- **Caching Strategy**: Redis-based caching
- **CDN Ready**: Static asset optimization

## Deployment

### Production Deployment

1. **Environment Setup**
   - Configure production environment variables
   - Set up SSL certificates
   - Configure domain and DNS

2. **Database Setup**
   - Create production database
   - Run migrations
   - Set up backups

3. **Deploy with Docker**
   ```bash
   docker-compose -f docker-compose.prod.yml up -d
   ```

### Monitoring

- **Application Logs**: Structured logging
- **Performance Metrics**: Response time tracking
- **Error Tracking**: Centralized error monitoring
- **Health Checks**: Service availability monitoring

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Issues

- Issues: [GitHub Issues](https://github.com/KAZI-CONNECT/kazi-connect/issues)

## Version History

- **v1.0.0** - Initial release with core features
- **v1.1.0** - Added AI-powered matching
- **v1.2.0** - Enhanced security features
- **v2.0.0** - Complete rewrite with improved architecture

---

## Author
Donnelly Amaitsa