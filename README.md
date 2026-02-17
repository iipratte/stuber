# STÜBER - BYU Ride-Sharing App

## Project Structure

This project is organized into three main directories:

- `/frontend` - React + Vite frontend application
- `/backend` - Express.js backend server
- `/db` - PostgreSQL database scripts (schema.sql and seed.sql)

## Setup Instructions

### Prerequisites

- Node.js and npm installed
- PostgreSQL database server running

### Database Setup

**Option 1: Automated Setup (Recommended)**

Run the setup script from the `db` directory:

**Windows (PowerShell):**
```powershell
cd db
.\setup.ps1
```

**Linux/Mac:**
```bash
cd db
chmod +x setup.sh
./setup.sh
```

**Option 2: Manual Setup**

1. Create a PostgreSQL database named `stuber`:
```bash
# Windows/Linux/Mac
psql -U postgres -c "CREATE DATABASE stuber;"
```

2. Run the schema to create the users table:
```bash
psql -U postgres -d stuber -f db/schema.sql
```

3. Seed the database with initial data:
```bash
psql -U postgres -d stuber -f db/seed.sql
```

**Note:** You may be prompted for your PostgreSQL password. If you don't have a password set, you can leave it blank or set the `PGPASSWORD` environment variable.

### Backend Setup

1. Navigate to the backend directory:
```bash
cd backend
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file (copy from `.env.example`):
```bash
cp .env.example .env
```

4. Update the `.env` file with your PostgreSQL credentials.

5. Start the backend server:
```bash
npm run dev
```

The backend will run on `http://localhost:3000`

### Frontend Setup

1. Navigate to the frontend directory:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file with the API URL (optional, defaults to `http://localhost:3000`):
```
VITE_API_URL=http://localhost:3000
```

4. Start the development server:
```bash
npm run dev
```

The frontend will run on `http://localhost:8080`

**Edit a file directly in GitHub**

- Navigate to the desired file(s).
- Click the "Edit" button (pencil icon) at the top right of the file view.
- Make your changes and commit the changes.

**Use GitHub Codespaces**

- Navigate to the main page of your repository.
- Click on the "Code" button (green button) near the top right.
- Select the "Codespaces" tab.
- Click on "New codespace" to launch a new Codespace environment.
- Edit files directly within the Codespace and commit and push your changes once you're done.

## What technologies are used for this project?

This project is built with:

- Vite
- TypeScript
- React
- shadcn-ui
- Tailwind CSS

## How can I deploy this project?

Simply open [Lovable](https://lovable.dev/projects/REPLACE_WITH_PROJECT_ID) and click on Share -> Publish.

## Can I connect a custom domain to my Lovable project?

Yes, you can!

To connect a domain, navigate to Project > Settings > Domains and click Connect Domain.

Read more here: [Setting up a custom domain](https://docs.lovable.dev/features/custom-domain#custom-domain)
