# Quick Setup Guide

## Prerequisites

- Node.js 18+
- PostgreSQL database (or use a free tier from Supabase/Neon)

## Steps

### 1. Clone and Install

```bash
cd /home/user/Blister
npm install
```

### 2. Configure Environment

Copy `.env.example` to `.env` and update:

```bash
cp .env.example .env
```

Edit `.env`:

```env
DATABASE_URL="postgresql://user:password@localhost:5432/blister?schema=public"
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="$(openssl rand -base64 32)"
NODE_ENV="development"
```

### 3. Set Up Database

```bash
# Generate Prisma Client
npx prisma generate

# Run migrations
npx prisma migrate dev --name init
```

### 4. (Optional) Seed Test Data

Create `prisma/seed.ts`:

```typescript
import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  const org = await prisma.organization.create({
    data: {
      name: 'Acme Inc',
      domain: 'acme.com',
      billingEmail: 'billing@acme.com',
    },
  })

  const hashedPassword = await bcrypt.hash('password123', 10)

  const admin = await prisma.user.create({
    data: {
      email: 'admin@acme.com',
      name: 'Admin User',
      password: hashedPassword,
      memberships: {
        create: {
          organizationId: org.id,
          role: 'ORG_ADMIN',
        },
      },
    },
  })

  const employee = await prisma.user.create({
    data: {
      email: 'employee@acme.com',
      name: 'Employee User',
      password: hashedPassword,
      memberships: {
        create: {
          organizationId: org.id,
          role: 'EMPLOYEE',
        },
      },
    },
  })

  console.log({ org, admin, employee })
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect())
```

Run seed:

```bash
npm install -D ts-node
npx prisma db seed
```

### 5. Start Development Server

```bash
npm run dev
```

Visit: http://localhost:3000

## Test Accounts (if seeded)

**Admin Account:**
- Email: `admin@acme.com`
- Password: `password123`
- Role: ORG_ADMIN

**Employee Account:**
- Email: `employee@acme.com`
- Password: `password123`
- Role: EMPLOYEE

## Common Issues

### Database Connection Error

Make sure PostgreSQL is running:

```bash
# macOS
brew services start postgresql

# Linux
sudo systemctl start postgresql
```

### Prisma Client Not Generated

Run:

```bash
npx prisma generate
```

### Port Already in Use

Change the port in dev mode:

```bash
PORT=3001 npm run dev
```

## Next Steps

1. Sign up at `/auth/login`
2. Create your organization
3. Invite team members
4. Configure onboarding journeys
5. Customize branding

## Need Help?

- Check the main [README.md](./README.md)
- View the Prisma schema at `prisma/schema.prisma`
- Open an issue on GitHub
