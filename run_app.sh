#!/bin/bash

# Set up python env
python3 -m venv env
env/bin/pip3 install -r backend/requirements.txt

# Set up node env
npm --prefix frontend/app install
npm --prefix frontend/app run build


# Backend: Start Flask Server
env/bin/gunicorn --chdir ./backend wsgi:app &

# Frontend: Serve Static React App
(cd frontend/app; npx serve -s build)
