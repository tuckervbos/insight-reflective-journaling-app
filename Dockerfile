FROM python:3.9.18-alpine3.18

# install dependencies
RUN apk add build-base
RUN apk add postgresql-dev gcc python3-dev musl-dev

# set build arguments
ARG FLASK_APP
ARG FLASK_ENV
ARG DATABASE_URL
ARG SCHEMA
ARG SECRET_KEY
ARG WEATHER_API_KEY
ARG WEATHER_API_URL
ARG MOON_API_URL

# set working directory
WORKDIR /var/www

# copy and install dependencies
COPY requirements.txt .
RUN pip install -r requirements.txt
RUN pip install psycopg2

# copy the full application code
COPY . .

# run migrations and seed database

RUN flask db init || true
RUN flask db migrate || true
RUN flask db upgrade
RUN flask seed all

# start the application
CMD gunicorn app:app