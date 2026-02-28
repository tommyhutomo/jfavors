import { PrismaClient } from '@prisma/client';

const globalForPrisma = global as unknown as { prisma?: PrismaClient };

function createPrismaClient(): PrismaClient {
  const options: Record<string, unknown> = { log: ['error', 'warn'] };
  if (process.env.PRISMA_ACCELERATE_URL) options.accelerateUrl = process.env.PRISMA_ACCELERATE_URL;

  const client = new PrismaClient(options as any);
  if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = client;
  return client;
}

let _prisma: PrismaClient | undefined = globalForPrisma.prisma;

const handler: ProxyHandler<any> = {
  get(_target, prop) {
    if (!_prisma) {
      _prisma = createPrismaClient();
    }
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    const value = (_prisma as any)[prop];
    if (typeof value === 'function') return value.bind(_prisma);
    return value;
  },
  set(_target, prop, value) {
    if (!_prisma) _prisma = createPrismaClient();
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    (_prisma as any)[prop] = value;
    return true;
  },
};

export const prisma = new Proxy({}, handler) as unknown as PrismaClient;