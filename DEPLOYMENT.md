# Deployment Guide for NGIT Institute

This project is configured to be deployed using Docker and Docker Compose on a VPS (Virtual Private Server).

## Prerequisites

1.  A VPS running a Linux distribution (e.g., Ubuntu 22.04 LTS).
2.  Docker and Docker Compose installed on the VPS.
3.  A domain name pointing to your VPS IP address.

## Step-by-Step Deployment

### 1. Prepare Environment Variables
On your VPS, create a `.env.production` file in your project root and fill it with your production credentials (use `.env.example` as a template).

```bash
cp .env.example .env.production
nano .env.production
```

### 2. Build and Start the Containers

Run the following command in the project root:

```bash
docker compose up -d --build
```

This will:
- Build the Next.js application using the multi-stage `Dockerfile`.
- Start the application in a container named `ngit-app`.
- Map port 3000 of the container to port 3000 on your VPS.

### 3. Database Seeding (Optional)
If you need to seed your production database, you can run the seed script inside the running container:

```bash
docker exec -it ngit-app npm run seed
```

## Reverse Proxy (Recommended)

For production, it is highly recommended to use a reverse proxy like **Nginx** or **Traefik** to handle SSL (HTTPS) and port forwarding (80/443 to 3000).

### Sample Nginx Configuration

```nginx
server {
    listen 80;
    server_name yourdomain.com;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

## CI/CD (Optional)

You can set up GitHub Actions to automatically deploy to your VPS on every push to the `main` branch.

### Key Files Created
- `Dockerfile`: Multi-stage build for production.
- `docker-compose.yml`: Local/VPS container orchestration.
- `.dockerignore`: Optimizes build by excluding unnecessary files.
- `next.config.ts`: Updated with `output: 'standalone'` for better Docker integration.
