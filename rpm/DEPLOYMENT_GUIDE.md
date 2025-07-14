# RPM Platform Deployment Guide

This guide provides instructions for deploying and running the RPM platform.

## 1. Prerequisites

- Git
- Python 3.11+
- pip (Python package installer)
- Node.js (if rebuilding frontend, otherwise pre-built)
- pnpm (Node.js package manager, if rebuilding frontend)

## 2. Clone the Repository

```bash
git clone https://github.com/krishankshh/RPM.git
cd RPM
```

## 3. Backend Setup

1. Navigate to the backend directory:
   ```bash
   cd rpm/backend
   ```

2. Create a virtual environment and install Python dependencies:
   ```bash
   python3.11 -m venv venv
   source venv/bin/activate
   pip install -r requirements.txt
   ```

3. Create a `.env` file in the `rpm/backend/src` directory with the following content:
   ```
   MONGO_URI='your_mongodb_connection_string'
   JWT_SECRET_KEY='your_jwt_secret_key'
   GOOGLE_CLIENT_ID='your_google_client_id'
   GOOGLE_CLIENT_SECRET='your_google_client_secret'
   ```
   **Note:** Replace the placeholder values with your actual credentials. The `MONGO_URI` should point to the `ai_tutoring_platform` database.

4. Run the Flask backend application:
   ```bash
   cd src
   python3.11 main.py
   ```
   The backend will typically run on `http://localhost:5000`.

## 4. Frontend Setup (Pre-built)

The frontend is pre-built and served as static files by the Flask backend. No separate frontend build process is required unless you intend to modify the frontend source code.

If you need to modify the frontend, the source code is expected to be in `rpm/frontend`. After making changes, you would typically build it and place the output in `rpm/backend/src/static/`.

## 5. Accessing the Application

Once the backend server is running, you can access the application through your web browser at the address where the Flask app is served (e.g., `http://localhost:5000`).

## 6. GitHub Push Process

To push changes to GitHub, ensure you have a Personal Access Token (PAT) with appropriate permissions. You can configure Git to use your PAT:

```bash
git remote set-url origin https://<YOUR_PAT>@github.com/krishankshh/RPM.git
```

Then, you can push your changes:

```bash
git add .
git commit -m "Your commit message"
git pull --rebase origin main # To integrate remote changes
git push origin main
```

**Important:** If you encounter merge conflicts during `git pull --rebase`, resolve them manually, add the resolved files, and then run `git rebase --continue`.

