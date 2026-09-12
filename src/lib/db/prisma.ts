import { PrismaClient } from '@prisma/client';

if (!process.env.PRISMA_CLIENT_ENGINE_TYPE) {
  process.env.PRISMA_CLIENT_ENGINE_TYPE = 'library';
}
if (!process.env.PRISMA_CLI_QUERY_ENGINE_TYPE) {
  process.env.PRISMA_CLI_QUERY_ENGINE_TYPE = 'library';
}

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

export const db =
  globalForPrisma.prisma ??
  new PrismaClient({
    log: ['error', 'warn'],
  });

globalForPrisma.prisma = db;
