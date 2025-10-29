# Quick Start Guide

Your project has **two separate applications**:

## Option 1: React SPA (Simple - No Database Required) ⭐ RECOMMENDED

This is the app with the **Admin Panel** that was just created.

### Steps:
1. **Stop any running servers** (Ctrl+C)
2. **Run the React app:**
   ```bash
   npm run start-react
   ```
3. **Open browser:** http://localhost:3000
4. **Login as Admin:**
   - Email: `admin@blister.com`
   - Password: `admin123`

You'll be automatically redirected to the Admin Panel where you can create and manage tasks!

---

## Option 2: Next.js App (Advanced - Requires Database)

This is the newer multi-tenant version with PostgreSQL.

### Prerequisites:
- PostgreSQL database running locally or remotely
- Database URL configured in `.env`

### Steps:
1. **Create `.env` file** in the root directory (already created for you):
   ```bash
   cp .env.example .env
   ```

2. **Update DATABASE_URL** in `.env` with your PostgreSQL credentials:
   ```
   DATABASE_URL="postgresql://YOUR_USER:YOUR_PASSWORD@localhost:5432/blister?schema=public"
   ```

3. **Set up the database:**
   ```bash
   npx prisma migrate dev --name init
   npx prisma generate
   ```

4. **Run the Next.js app:**
   ```bash
   npm run dev
   ```

5. **Open browser:** http://localhost:3000

---

## Which One Should I Use?

- **Use React SPA** (`npm run start-react`) if you:
  - Want to quickly test the admin panel
  - Don't need database persistence
  - Want the simpler setup

- **Use Next.js** (`npm run dev`) if you:
  - Need multi-tenant organizations
  - Need database persistence
  - Want the full production-ready version
  - Are willing to set up PostgreSQL

---

## Current Error Fix

If you're seeing `[next-auth][error][NO_SECRET]` errors, it means you're running the Next.js app without the database configured.

**Quick Fix:** Stop the server (Ctrl+C) and run:
```bash
npm run start-react
```

This will run the React SPA which doesn't need any database setup!
