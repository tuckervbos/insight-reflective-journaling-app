#!/bin/bash

# 1. run alembic migrations
flask db upgrade

# 2. seed database
flask seed all

# 3. finally start server (gunicorn)
exec gunicorn app:app