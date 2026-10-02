# Multi-stage lightweight Linux container for ToolBox Processing Worker
FROM node:20-bookworm-slim AS base

# Install system dependencies: Poppler, Ghostscript, LibreOffice headless, Python, Sharp build tools
RUN apt-get update && apt-get install -y --no-install-recommends \
    poppler-utils \
    ghostscript \
    libreoffice-core \
    libreoffice-writer \
    libreoffice-calc \
    python3 \
    python3-pip \
    ca-certificates \
    && rm -rf /var/lib/apt/lists/*

# Install python pdf libraries
RUN pip3 install --no-cache-dir --break-system-packages pypdf pdfplumber Pillow

WORKDIR /app

# Create non-root user for security
RUN groupadd -r appgroup && useradd -r -g appgroup -d /app appuser

COPY package.json ./
RUN npm install

COPY . .

RUN chown -R appuser:appgroup /app
USER appuser

ENV NODE_ENV=production
CMD ["npm", "start"]

