import { PrismaClient } from '@prisma/client';
import appConfig from 'configs/app';

let prisma = globalThis.prisma ?? new PrismaClient({ log: ['query'] });

if (appConfig.nodeEnv !== 'production') {
  globalThis.prisma = prisma;
}

export default prisma;
