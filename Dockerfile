# Use an official Python runtime as a parent image
FROM python:3.12.3-slim

# Set environment variables
ENV PYTHONDONTWRITEBYTECODE=1
ENV PYTHONUNBUFFERED=1

# Set work directory
WORKDIR /app/backend

# Install system dependencies
RUN apt-get update && apt-get install -y \
    gcc \
    && rm -rf /var/lib/apt/lists/*

# Copy the requirements file into the image
COPY backend/requirements.txt /app/backend/requirements.txt

# Upgrade pip and install Python dependencies
RUN pip install --upgrade pip \
    && pip install -r requirements.txt

# Copy the backend project code
COPY backend/ /app/backend/

# Run migrations, collect static files, and start the server
RUN python manage.py migrate \
    && python manage.py collectstatic --noinput

# Expose the port the app runs on
EXPOSE 8000

# Use gunicorn to serve the application
CMD ["gunicorn", "gradHunt.wsgi:application", "--bind", "0.0.0.0:8000"]
