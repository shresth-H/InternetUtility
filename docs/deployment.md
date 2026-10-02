# Production Deployment & Infrastructure

## 1. Zero-Cost V1 Target Architecture

```text
┌────────────────────────────────────────────────────────────┐
│                    Cloudflare (Free Plan)                  │
│  - DNS & Edge CDN                                          │
│  - R2 Object Storage (10 GB free / month, $0 egress)       │
└─────────────────────────────┬──────────────────────────────┘
                              │
                              ▼
┌────────────────────────────────────────────────────────────┐
│                 Frontend & API Hosting                     │
│  - Vercel / Netlify / Cloudflare Pages (Free Tier)         │
│  - Node.js Server / Render Web Service                     │
└─────────────────────────────┬──────────────────────────────┘
                              │
                              ▼
┌────────────────────────────────────────────────────────────┐
│              Processing Worker (Docker Container)          │
│  - Local execution / Render free container / Self-hosted   │
│  - Executes Sharp, pdf-lib, LibreOffice, Ghostscript       │
└────────────────────────────────────────────────────────────┘
```

## 2. Cloudflare R2 Configuration

1. Create a Cloudflare account and create an R2 bucket named `toolbox-files`.
2. Generate an R2 API Token with **Object Read & Write** permissions.
3. Set the following environment variables in your hosting dashboard:

```bash
R2_ACCOUNT_ID="your_cloudflare_account_id"
R2_ACCESS_KEY_ID="your_r2_access_key"
R2_SECRET_ACCESS_KEY="your_r2_secret_key"
R2_BUCKET_NAME="toolbox-files"
```

## 3. Docker Deployment

To run the complete platform (Web app + Processing Worker) with Docker Compose:

```bash
# Build and start all containers in background
docker compose up -d --build

# View logs
docker compose logs -f
```

## 4. Cost Breakdown (V1)

| Service | Provider | Allocation | Monthly Cost |
| :--- | :--- | :--- | :--- |
| **Control Plane & Web** | Vercel / Netlify / Pages | 100k requests / day | **₹0** |
| **Object Storage** | Cloudflare R2 | 10 GB storage, 1M Class A ops | **₹0** |
| **Data Transfer** | Cloudflare R2 | Unlimited egress | **₹0** |
| **Total Estimated Cost** | — | — | **₹0 / month** |

