# Dockerfile for Django
FROM python:3.12

# Set environment variables
ENV PYTHONDONTWRITEBYTECODE=1
ENV PYTHONUNBUFFERED=1

# Set work directory
WORKDIR /backend

# Copy the current directory contents into the container at /backend
COPY . /backend

# Install dependencies
COPY requirements.txt /app/
RUN pip install --upgrade pip
RUN pip install -r requirements.txt


ENV DJANGO_SETTINGS_MODULE=backend.settings

# Make port 8000 available to the world outside this container
EXPOSE 8000

# Run Django server
CMD ["python", "manage.py", "runserver", "0.0.0.0:8000"]
