import { StatusCodes } from 'http-status-codes';
import { AppRouterFactory } from '@factories/app-router.factory';

export const AnalyticsRoute = AppRouterFactory.createApp();

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
				const shorterners = await context.shorterner.count();

				const redirectings = await context.analytic.count();

				return { shorterners, redirectings };
			},
		);

		await ctx.var.redis.set(
			'analytics',
			JSON.stringify(analytics),
			'EX',
			5 * 60, // 5 minutes
		);

		return ctx.json(analytics, StatusCodes.OK);
	},
);
