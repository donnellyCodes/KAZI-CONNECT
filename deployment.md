# Deployment Guide

This guide covers deploying KAZI CONNECT to production environments.

## 🚀 Production Deployment

### Prerequisites

- **Domain name** configured with DNS
- **SSL certificates** (Let's Encrypt recommended)
- **Server** with at least 2GB RAM, 2 CPU cores
- **Docker & Docker Compose** installed
- **PostgreSQL** database (can be managed service)

### Step 1: Server Setup

```bash
# Update system
sudo apt update && sudo apt upgrade -y

# Install Docker
curl -fsSL https://get.docker.com -o get-docker.sh
sudo sh get-docker.sh

# Install Docker Compose
sudo curl -L "https://github.com/docker/compose/releases/latest/download/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
sudo chmod +x /usr/local/bin/docker-compose

# Create application directory
sudo mkdir -p /opt/kazi-connect
sudo chown $USER:$USER /opt/kazi-connect
cd /opt/kazi-connect
```

### Step 2: Application Setup

```bash
# Clone repository
git clone <your-repository-url> .

# Copy environment files
cp backend/.env.example backend/.env
cp frontend/.env.example frontend/.env

# Configure environment variables
nano backend/.env
```

### Step 3: Environment Configuration

Edit `backend/.env` with production values:

```env
# Database Configuration
DB_HOST=your-db-host
DB_PORT=5432
DB_NAME=kazi_connect_prod
DB_USER=kazi_user
DB_PASSWORD=secure_password_here

# JWT Configuration
JWT_SECRET=your_super_secure_jwt_secret_at_least_32_chars
JWT_EXPIRES_IN=90d

# Server Configuration
PORT=5000
NODE_ENV=production

# Frontend URL
FRONTEND_URL=https://yourdomain.com

# Email Configuration
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_app_password

# Security
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100
```

### Step 4: SSL Setup

```bash
# Install Certbot
sudo apt install certbot python3-certbot-nginx

# Obtain SSL certificate
sudo certbot --nginx -d yourdomain.com -d www.yourdomain.com

# Create SSL directory
mkdir -p ssl
sudo cp /etc/letsencrypt/live/yourdomain.com/fullchain.pem ssl/cert.pem
sudo cp /etc/letsencrypt/live/yourdomain.com/privkey.pem ssl/key.pem
sudo chown $USER:$USER ssl/*
```

### Step 5: Nginx Configuration

Update `nginx.conf` with your domain:

```nginx
server {
    listen 80;
    server_name yourdomain.com www.yourdomain.com;
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl http2;
    server_name yourdomain.com www.yourdomain.com;
    # ... rest of configuration
}
```

### Step 6: Deploy Application

```bash
# Build and start containers
docker-compose up -d

# Check logs
docker-compose logs -f

# Verify services
docker-compose ps
```

### Step 7: Database Setup

```bash
# Enter backend container
docker-compose exec app bash

# Run migrations
npm run migrate

# Create admin user (optional)
npm run seed:admin
```

## 🔧 Configuration Options

### Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `NODE_ENV` | Environment (development/production) | Yes |
| `PORT` | Backend port | Yes |
| `DB_HOST` | Database host | Yes |
| `DB_NAME` | Database name | Yes |
| `DB_USER` | Database user | Yes |
| `DB_PASSWORD` | Database password | Yes |
| `JWT_SECRET` | JWT signing secret | Yes |
| `FRONTEND_URL` | Frontend URL for CORS | Yes |
| `EMAIL_HOST` | SMTP server host | Yes |
| `EMAIL_USER` | SMTP username | Yes |
| `EMAIL_PASS` | SMTP password | Yes |

### Docker Compose Options

#### Development Mode
```yaml
# docker-compose.dev.yml
version: '3.8'
services:
  app:
    build:
      context: .
      target: builder
    volumes:
      - ./backend:/app/backend
      - ./frontend:/app/frontend
    environment:
      - NODE_ENV=development
    command: npm run dev
```

#### Production Mode
```yaml
# docker-compose.prod.yml
version: '3.8'
services:
  app:
    image: kazi-connect:latest
    restart: always
    environment:
      - NODE_ENV=production
    deploy:
      replicas: 2
      resources:
        limits:
          memory: 1G
        reservations:
          memory: 512M
```

## Monitoring and Logging

### Application Logs

```bash
# View all logs
docker-compose logs

# View specific service logs
docker-compose logs app
docker-compose logs postgres

# Follow logs in real-time
docker-compose logs -f --tail=100
```

### Health Checks

Add to `docker-compose.yml`:

```yaml
services:
  app:
    healthcheck:
      test: ["CMD", "curl", "-f", "http://localhost:5000/health"]
      interval: 30s
      timeout: 10s
      retries: 3
      start_period: 40s
```

### Monitoring Setup

```bash
# Install monitoring tools
docker run -d \
  --name prometheus \
  -p 9090:9090 \
  prom/prometheus

docker run -d \
  --name grafana \
  -p 3000:3000 \
  grafana/grafana
```

## Security Considerations

### Firewall Configuration

```bash
# Configure UFW firewall
sudo ufw default deny incoming
sudo ufw default allow outgoing
sudo ufw allow ssh
sudo ufw allow 80/tcp
sudo ufw allow 443/tcp
sudo ufw enable
```

### Security Headers

The Nginx configuration includes:
- X-Frame-Options
- X-XSS-Protection
- X-Content-Type-Options
- Content-Security-Policy
- Strict-Transport-Security

### Database Security

```bash
# Create dedicated database user
CREATE USER kazi_user WITH PASSWORD 'secure_password';
CREATE DATABASE kazi_connect_prod OWNER kazi_user;
GRANT ALL PRIVILEGES ON DATABASE kazi_connect_prod TO kazi_user;

# Restrict connections
# In postgresql.conf: listen_addresses = 'localhost'
# In pg_hba.conf: host kazi_connect_prod kazi_user 127.0.0.1/32 md5
```

## Updates and Maintenance

### Application Updates

```bash
# Pull latest changes
git pull origin main

# Rebuild and restart
docker-compose down
docker-compose build --no-cache
docker-compose up -d
```

### Database Backups

```bash
# Create backup script
cat > backup.sh << 'EOF'
#!/bin/bash
DATE=$(date +%Y%m%d_%H%M%S)
docker-compose exec -T postgres pg_dump -U kazi_user kazi_connect_prod > backup_$DATE.sql
gzip backup_$DATE.sql
EOF

# Schedule daily backups
crontab -e
# Add: 0 2 * * * /opt/kazi-connect/backup.sh
```

### SSL Certificate Renewal

```bash
# Auto-renewal (certbot handles this)
sudo crontab -e
# Add: 0 12 * * * /usr/bin/certbot renew --quiet
```

## Troubleshooting

### Common Issues

1. **Container won't start**
   ```bash
   docker-compose logs app
   # Check environment variables and database connection
   ```

2. **Database connection failed**
   ```bash
   docker-compose exec app ping postgres
   # Verify network connectivity
   ```

3. **SSL certificate errors**
   ```bash
   sudo certbot certificates
   # Check certificate status
   ```

4. **High memory usage**
   ```bash
   docker stats
   # Monitor resource usage
   ```

### Performance Optimization

1. **Database Optimization**
   - Add proper indexes
   - Monitor slow queries
   - Configure connection pooling

2. **Application Caching**
   - Implement Redis caching
   - Use CDN for static assets
   - Enable gzip compression

3. **Load Balancing**
   - Deploy multiple app instances
   - Configure Nginx load balancing
   - Use health checks

## Support

For deployment issues:
- Check logs: `docker-compose logs`
- Verify environment variables
- Ensure all services are running: `docker-compose ps`
- Monitor system resources: `htop`, `df -h`

## CI/CD Integration

### GitHub Actions Example

```yaml
# .github/workflows/deploy.yml
name: Deploy to Production

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - name: Deploy to server
        uses: appleboy/ssh-action@v0.1.4
        with:
          host: ${{ secrets.HOST }}
          username: ${{ secrets.USERNAME }}
          key: ${{ secrets.SSH_KEY }}
          script: |
            cd /opt/kazi-connect
            git pull origin main
            docker-compose down
            docker-compose build --no-cache
            docker-compose up -d
```

This deployment guide ensures a secure, scalable, and maintainable production environment for KAZI CONNECT.
