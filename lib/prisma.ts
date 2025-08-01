import { PrismaClient } from '@prisma/client';
import { transformDoctorModel, transformDoctorModels } from './prisma-helpers';

// PrismaClient is attached to the `global` object in development to prevent
// exhausting your database connection limit.
//
// Learn more: 
// https://pris.ly/d/help/next-js-best-practices

const globalForPrisma = global as unknown as { prisma: PrismaClient };

export const prisma = globalForPrisma.prisma || new PrismaClient();

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;

// Export helper functions for use with Prisma
export {
  transformDoctorModel,
  transformDoctorModels
};

export default prisma;
