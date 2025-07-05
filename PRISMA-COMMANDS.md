# Prisma Setup and Migration Commands

This document provides commands for setting up and running Prisma migrations in your Medicare project.

## Initial Setup (Already Done)

```bash
npm install prisma -D
npm install @prisma/client
npx prisma init
```

## Running Migrations

After defining your schema in `prisma/schema.prisma`, run these commands to create and apply your migrations:

```bash
# Create and apply a migration
npx prisma migrate dev --name init

# Apply migrations in production
npx prisma migrate deploy
```

## Generating the Prisma Client

If you need to manually generate the Prisma client:

```bash
npx prisma generate
```

## Creating and Using Seed Data

You can create seed data to populate your database with initial data:

1. Create a `prisma/seed.ts` file:

```typescript
import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

async function main() {
  // Create seed data here
  const admin = await prisma.user.upsert({
    where: { email: 'admin@medicare.com' },
    update: {},
    create: {
      email: 'admin@medicare.com',
      firstName: 'Admin',
      lastName: 'User',
      phone: '123456789',
      role: 'ADMIN',
      isActive: true,
    },
  })

  console.log({ admin })
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

2. Add this to your `package.json`:

```json
{
  "prisma": {
    "seed": "ts-node prisma/seed.ts"
  }
}
```

3. Run seed command:

```bash
npx prisma db seed
```

## Exploring Your Database

Prisma provides a GUI tool to explore your database:

```bash
npx prisma studio
```

This opens a browser interface at http://localhost:5555 where you can view and edit your data.

## Other Useful Commands

```bash
# Validate your schema
npx prisma validate

# Format your schema
npx prisma format

# Pull schema from existing database
npx prisma db pull

# Push schema to database without migrations
npx prisma db push
```

## Troubleshooting

If you encounter errors with migrations:

```bash
# Reset the database and apply migrations again
npx prisma migrate reset

# Check status of migrations
npx prisma migrate status
```

For more details, refer to the [Prisma documentation](https://www.prisma.io/docs/).
