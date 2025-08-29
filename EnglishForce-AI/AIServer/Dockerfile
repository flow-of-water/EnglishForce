FROM python:3.12-slim

WORKDIR /app

# (Tùy dự án) Cài gói hệ thống thường cần khi build lib Python
# Nếu dự án bạn thuần FastAPI/Flask, có thể bỏ nguyên RUN này cho nhẹ
RUN apt-get update && apt-get install -y --no-install-recommends \
    build-essential \
    && rm -rf /var/lib/apt/lists/*

# Cài dependency
COPY requirements.txt* /app/
RUN if [ -f requirements.txt ]; then pip install --no-cache-dir -r requirements.txt; fi

# Copy source
COPY . .

ENV PYTHONUNBUFFERED=1
EXPOSE 8000

# Bạn đang chạy: python server.py
CMD ["python", "server.py"]
