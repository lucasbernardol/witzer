import { createFactory } from 'hono/factory';
import type { PrismaClient } from '@prisma/client';
import type { Redis } from 'ioredis';

import { prismaClient } from '@modules/drivers/prismaClient';
import { redisConnection } from '@modules/redis';
import { nanoid } from '@utils/nanoid.util';

export type ApplicationWithPrismaEnv = {
	Variables: {
		prismaClient: PrismaClient;
		nanoid: (size?: number | undefined) => Promise<string>;
		redis: Redis;
		userAgent: string | null;
	};
};

export const AppRouterFactory = createFactory<ApplicationWithPrismaEnv>({
	initApp: (app) => {
		app.use(async (ctx, next) => {
			ctx.set('prismaClient', prismaClient);
			ctx.set('nanoid', nanoid);
			ctx.set('redis', redisConnection);
			ctx.set('userAgent', null);

			await next();
		});
	},
});
