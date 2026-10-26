# Build the React site, then serve it and the API from the same Render service.
FROM node:22-alpine AS frontend-build
WORKDIR /frontend
COPY frontend/package*.json ./
RUN npm ci
COPY frontend/ ./
RUN npm run build

FROM python:3.11-slim
WORKDIR /app

RUN apt-get update && apt-get install -y --no-install-recommends \
    build-essential \
    curl \
    && rm -rf /var/lib/apt/lists/*

COPY backend/requirements.txt ./requirements.txt
RUN pip install --no-cache-dir -r requirements.txt

COPY backend/ ./
COPY --from=frontend-build /frontend/dist ./frontend-dist
RUN mkdir -p /app/uploads /var/data && \
    useradd --create-home --uid 10001 appuser && \
    chown -R appuser:appuser /app /var/data

# Render mounts persistent storage at /var/data. The runtime user owns this
# directory in the image; keep the same location for SQLite and uploaded files.
USER appuser
EXPOSE 8000
CMD ["sh", "-c", "exec uvicorn app.main:app --host 0.0.0.0 --port ${PORT:-8000}"]
