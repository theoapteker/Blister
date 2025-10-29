# Blister - Multi-Tenant Onboarding Platform

A modern B2B SaaS onboarding platform with organizational login, role-based access control (RBAC), and smart routing.

## Features

- **Multi-Tenant Architecture**: Organizations can have multiple users with different roles
- **Role-Based Access Control (RBAC)**:
  - `ORG_ADMIN` - Full access to billing, SSO, branding, content configuration, and analytics
  - `MANAGER` - Can invite employees, assign journeys/buddies, view team analytics
  - `EMPLOYEE` - Consumes onboarding content in the Launchpad
  - `CONTENT_EDITOR` - Manage onboarding content
  - `BILLING_ADMIN` - Manage billing and subscriptions
- **Smart Routing**: Automatically routes users based on their highest role in the active organization
- **Organization Chooser**: Users belonging to multiple organizations can switch between them
- **Unified Login/Signup**: Single entry point for authentication

## Tech Stack

- **Frontend**: Next.js 14 (App Router), React 18, TypeScript
- **Authentication**: NextAuth.js (Auth.js)
- **Database**: PostgreSQL with Prisma ORM
- **Styling**: Tailwind CSS
- **Animations**: Framer Motion
- **Icons**: Lucide React
- **Charts**: Recharts

## Getting Started

### Prerequisites

- Node.js 18+ and npm/yarn
- PostgreSQL database (local or cloud-hosted)

### 1. Install Dependencies

```bash
npm install
```

### 2. Set Up Environment Variables

Create a `.env` file in the root directory:

```env
# Database
DATABASE_URL="postgresql://user:password@localhost:5432/blister?schema=public"

# NextAuth
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="generate-with-openssl-rand-base64-32"

# App
NODE_ENV="development"
```

To generate a secure `NEXTAUTH_SECRET`:

```bash
openssl rand -base64 32
```

### 3. Set Up Database

Initialize Prisma and create the database schema:

```bash
# Generate Prisma Client
npx prisma generate

# Create database migration
npx prisma migrate dev --name init

# (Optional) Open Prisma Studio to view your database
npx prisma studio
```

### 4. Seed the Database (Optional)

Create a seed file to add test data:

```bash
# Create seed script
touch prisma/seed.ts
```

Example seed script:

```typescript
import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  // Create organization
  const org = await prisma.organization.create({
    data: {
      name: 'Acme Inc',
      domain: 'acme.com',
      billingEmail: 'billing@acme.com',
    },
  })

  // Create admin user
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

  console.log({ org, admin })
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
```

Add to package.json:

```json
{
  "prisma": {
    "seed": "ts-node --compiler-options {\"module\":\"CommonJS\"} prisma/seed.ts"
  }
}
```

Run seed:

```bash
npm install -D ts-node
npx prisma db seed
```

### 5. Run Development Server

```bash
npm run dev
```

Visit [http://localhost:3000](http://localhost:3000)

## Project Structure

```
/home/user/Blister/
├── prisma/
│   └── schema.prisma           # Database schema
├── src/
│   ├── app/
│   │   ├── api/
│   │   │   └── auth/           # NextAuth endpoints
│   │   ├── auth/
│   │   │   ├── login/          # Unified login/signup page
│   │   │   └── org-select/     # Organization chooser
│   │   ├── admin/              # Admin console (ADMIN, MANAGER)
│   │   ├── launchpad/          # Employee onboarding
│   │   ├── layout.tsx          # Root layout
│   │   ├── page.tsx            # Root page (redirects)
│   │   └── globals.css         # Global styles
│   ├── lib/
│   │   ├── auth.ts             # NextAuth configuration
│   │   └── prisma.ts           # Prisma client
│   ├── middleware.ts           # RBAC middleware
│   └── components/             # Legacy CRA components (to be migrated)
├── next.config.js
├── tailwind.config.ts
└── tsconfig.json
```

## Authentication Flow

### Sign Up Flow

1. User visits `/auth/login`
2. Clicks "Sign up"
3. Two scenarios:
   - **With invite token**: User is joining an existing organization
   - **Without invite**: User creates a new organization (becomes ORG_ADMIN)
4. After signup, user is auto-signed in
5. Redirected to `/auth/org-select`
6. Based on role:
   - `ORG_ADMIN` or `MANAGER` → `/admin`
   - `EMPLOYEE` → `/launchpad`

### Sign In Flow

1. User visits `/auth/login`
2. Enters email and password
3. Redirected to `/auth/org-select`
4. If single org: auto-selects and redirects
5. If multiple orgs: user chooses organization
6. Smart routing based on role in selected org

## Database Schema

### Core Models

- **Organization**: Customer account (e.g., "Acme Inc")
- **User**: Human users with email/password authentication
- **Membership**: Links users to organizations with roles
- **Journey**: Onboarding content for employees
- **BuddyMatch**: Peer mentor assignments
- **Invite**: Email invitations to join an organization

### Relationships

```
Organization 1 → N Membership
User 1 → N Membership
Membership N → 1 Organization
Membership N → 1 User
```

## API Endpoints

### Authentication

- `POST /api/auth/signup` - Create new user account
- `POST /api/auth/[...nextauth]` - NextAuth endpoints (login, logout, session)

### Protected Routes

All routes except `/auth/*` require authentication. Role-based access is enforced via middleware:

- `/admin/*` - Requires `ORG_ADMIN` or `MANAGER`
- `/launchpad/*` - All authenticated users

## Deployment

### Environment Variables (Production)

```env
DATABASE_URL="your-production-database-url"
NEXTAUTH_URL="https://your-domain.com"
NEXTAUTH_SECRET="your-production-secret"
NODE_ENV="production"
```

### Deploy to Vercel

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel
```

### Database Migrations

Run migrations on production:

```bash
npx prisma migrate deploy
```

## Development Roadmap

### Completed
- ✅ Multi-tenant database schema
- ✅ NextAuth.js authentication
- ✅ RBAC middleware
- ✅ Login/Signup pages
- ✅ Organization chooser
- ✅ Admin console layout
- ✅ Employee launchpad

### To Do
- [ ] Invite system (email invites)
- [ ] SSO integration (Google, Microsoft)
- [ ] Domain hinting for SSO
- [ ] Journey management (create, edit, assign)
- [ ] Buddy matching system
- [ ] Analytics dashboard
- [ ] Billing integration
- [ ] Content editor
- [ ] Mobile responsive design
- [ ] Email notifications

## Contributing

1. Create a feature branch from `main`
2. Make your changes
3. Test thoroughly
4. Submit a pull request

## License

Proprietary - All rights reserved

## Support

For questions or issues, contact the development team.
