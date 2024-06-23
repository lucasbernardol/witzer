import { zValidator } from '@hono/zod-validator';
import { HTTPException } from 'hono/http-exception';
import { StatusCodes } from 'http-status-codes';
import { z } from 'zod';

import { AppRouterFactory } from '@factories/app-router.factory';
import { AnalyticsQueue } from '@modules/queues/analytics-queue';

import { zodValidationHook } from '@utils/zod-validation-hook.util';
import { nanoid } from '@schemas/nanoid.schema';

const analyticsQueue = new AnalyticsQueue();

export const ShorternerRedirectRoute = AppRouterFactory.createApp();

type JobData = {
	userAgent: string;
	shorternerId: string;
};

ShorternerRedirectRoute.get(
	'/:hash',
	zValidator(
		'param',
		z.object({ hash: nanoid() }).required(),
		zodValidationHook,
	),
	async (ctx, next) => {
		// Chekc if cache exists
		const { hash } = ctx.req.valid('param');

		const shortener = await ctx.var.redis.get(hash);

		// save user-agent
		const userAgent = ctx.req.header('User-Agent') ?? 'unknown';

		ctx.set('userAgent', userAgent);

		if (shortener) {
			// Add queue // userAgent, shortenerid
			const { href, shorternerId } = JSON.parse(shortener);

			await analyticsQueue.addJob<JobData>({ userAgent, shorternerId });

			// Remove analytics caching
			await ctx.var.redis.del('analytics');

			return ctx.redirect(href, StatusCodes.MOVED_TEMPORARILY);
		}

		await next();
	},
	async (ctx) => {
		const { hash } = ctx.req.valid('param');

		const shorterner = await ctx.var.prismaClient.shorterner.findUnique({
			where: {
				hash,
			},
		});

		if (!shorterner) {
			throw new HTTPException(StatusCodes.BAD_REQUEST, {
				message: 'Invalid hash!',
			});
		}

		await ctx.var.redis.set(
			hash,
			JSON.stringify({
				href: shorterner.href,
				shorternerId: shorterner.id,
			}),
			'EX',
			30 * 60,
		);

		// Add analytocs to queue
		await analyticsQueue.addJob<JobData>({
			userAgent: ctx.var.userAgent as string,
			shorternerId: shorterner.id,
		});

		// Change analytics redis/caching
		await ctx.var.redis.del('analytics');

		return ctx.redirect(shorterner.href, StatusCodes.MOVED_TEMPORARILY);
	},
);
