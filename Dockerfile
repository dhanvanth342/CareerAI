FROM python:3.9.7

RUN apt-get update && \
    apt-get install -y --no-install-recommends \
    graphviz \
    libgl1-mesa-glx \
    libglib2.0-0 \
    && rm -rf /var/lib/apt/lists/*
# Ensure Graphviz Python package is installed
RUN pip install graphviz
WORKDIR /app
COPY backend/requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt
COPY backend/ .
EXPOSE 5000
CMD ["gunicorn", "--bind", "0.0.0.0:5000", "flask_api:app"]