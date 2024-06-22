import { StatusCodes } from 'http-status-codes';
import { AppRouterFactory } from '@factories/app-router.factory';

export const AnalyticsRoute = AppRouterFactory.createApp();

AnalyticsRoute.get('/analytics', async (ctx) => {
	// Analytics
	const [shorteners, redirectings] = await ctx.var.prismaClient.$transaction(
		async (context) => {
			const shorts = await context.shortener.count();

			const analytics = await context.analytic.count();

			return [shorts, analytics];
		},
	);

	return ctx.json({ shorteners, redirectings }, StatusCodes.OK);
});
