import { PrismaClient } from '@prisma/client';
import process from 'node:process';

export const prismaClient = new PrismaClient({
  log: process.env.NODE_ENV === 'production' ? [] : ['query'],
});
