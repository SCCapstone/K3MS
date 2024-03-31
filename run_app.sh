#!/bin/bash

# Set up python env
python3 -m venv env
env/bin/pip3 install -r backend/requirements.txt

# Set up node env
npm --prefix frontend/app ci

# Backend: Start Flask Server
env/bin/gunicorn --chdir ./backend wsgi:app &

# Frontend: Start React App
npm --prefix frontend/app run dev
