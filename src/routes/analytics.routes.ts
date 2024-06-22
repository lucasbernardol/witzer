import { StatusCodes } from 'http-status-codes';
import { AppRouterFactory } from '@factories/app-router.factory';

export const AnalyticsRoute = AppRouterFactory.createApp();

const ANALYTICS_EXPIRES = 30 * 60; // 30 minutes (seconds)

AnalyticsRoute.get(
	'/analytics',
	async (ctx, next) => {
		const analyticsOnCache = await ctx.var.redis.get('analytics');

		if (analyticsOnCache) {
			const analytics = JSON.parse(analyticsOnCache);

			return ctx.json(analytics, StatusCodes.OK);
		}

		await next();
	},
	async (ctx) => {
		const analytics = await ctx.var.prismaClient.$transaction(
			async (context) => {
				const shorteners = await context.shortener.count();

				const redirectings = await context.analytic.count();

				return { shorteners, redirectings };
			},
		);

		await ctx.var.redis.set(
			'analytics',
			JSON.stringify(analytics),
			'EX',
			ANALYTICS_EXPIRES,
		);

		return ctx.json(analytics, StatusCodes.OK);
	},
);
