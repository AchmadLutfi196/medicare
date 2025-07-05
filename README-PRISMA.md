# Medicare - Next.js Healthcare Application

A modern healthcare application built with Next.js, Tailwind CSS, and Prisma.

## Features

- Patient appointment booking
- Doctor profiles and management
- Admin dashboard
- Article/blog publishing
- Testimonials
- User authentication

## Tech Stack

- **Frontend:** Next.js, React, Tailwind CSS
- **Database:** PostgreSQL with Prisma ORM
- **Authentication:** Custom auth solution

## Getting Started

### Prerequisites

- Node.js (v16+)
- PostgreSQL (v12+)

### Installation

1. Clone the repository:

```bash
git clone https://github.com/yourusername/medicare.git
cd medicare
```

2. Install dependencies:

```bash
npm install
```

3. Set up environment variables:

Copy the example env file and update the values as needed:

```bash
cp .env.example .env
```

4. Set up the database:

```bash
# Create and apply migrations
npm run prisma:migrate

# Generate Prisma client
npm run prisma:generate

# Seed the database with initial data
npx prisma db seed
```

5. Run the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to see the application.

## Database Management with Prisma

This project uses Prisma ORM for database operations.

### Common Prisma Commands

```bash
# View and manage your database with Prisma Studio
npm run prisma:studio

# Create a new migration
npx prisma migrate dev --name your_migration_name

# Apply migrations
npx prisma migrate deploy

# Generate Prisma client after schema changes
npm run prisma:generate
```

### Database Schema

The database schema is defined in `prisma/schema.prisma`. Key models include:

- User (patients, doctors, admins)
- Doctor (doctor profiles)
- Schedule (doctor availability)
- Appointment (patient bookings)
- Content (articles/blog posts)
- Testimonial (patient reviews)

## Project Structure

```
medicare/
├── app/                  # Next.js application routes
│   ├── admin/            # Admin dashboard
│   ├── api/              # API routes
│   └── components/       # Shared UI components
├── contexts/             # React contexts
├── hooks/                # Custom React hooks
├── lib/                  # Library code
│   └── prisma.ts         # Prisma client
├── prisma/               # Prisma schema and migrations
│   ├── migrations/       # Database migrations
│   └── schema.prisma     # Database schema
├── public/               # Static assets
├── scripts/              # Utility scripts
├── services/             # Business logic
└── types/                # TypeScript types
```

## Contributing

1. Fork the repository
2. Create your feature branch: `git checkout -b feature/amazing-feature`
3. Commit your changes: `git commit -m 'Add some amazing feature'`
4. Push to the branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.
