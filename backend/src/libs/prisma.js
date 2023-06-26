import { PrismaClient, Prisma } from '@prisma/client';

import appConfig from 'configs/app';
import dbConfig from 'configs/db';

let prisma = globalThis.prisma ?? new PrismaClient({ log: ['query'] });

prisma.$use(async (params, next) => {
  if (dbConfig.softDeleteEnabledOnModels.includes(params.model)) {
    switch (params.action) {
      case 'findFirst':
      case 'findUnique':
        params.action = 'findFirst';
        params.args.where['deletedAt'] = Prisma.AnyNull;
        break;
      case 'findMany':
        if (params.args.where && params.args.where.deletedAt == undefined)
          params.args.where['deletedAt'] = Prisma.AnyNull;
        else params.args['where'] = { deletedAt: Prisma.AnyNull };
        break;
      case 'update':
        params.action = 'updateMany';
        params.args.where['deletedAt'] = Prisma.AnyNull;
        break;
      case 'updateMany':
        if (params.args.where && params.args.where.deletedAt != undefined)
          params.args.where['deletedAt'] = Prisma.AnyNull;
        else params.args['where'] = { deletedAt: Prisma.AnyNull };
        break;
      case 'delete':
        params.action = 'update';
        params.args.data['deletedAt'] = new Date();
        break;
      case 'deleteMany':
        params.action = 'updateMany';
        if (params.args.data != undefined) params.args.data['deletedAt'] = new Date();
        else params.args['data'] = { deletedAt: new Date() };
        break;
    }
  }

  return next(params);
});

if (appConfig.nodeEnv !== 'production') {
  globalThis.prisma = prisma;
}

export default prisma;
