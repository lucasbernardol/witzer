//import { zValidator } from '@hono/zod-validator';
import { Hono } from 'hono';

import { StatusCodes } from 'http-status-codes';
import { prismaClient } from '../prismaClient';

export const AnalyticRoute = new Hono();

AnalyticRoute.get('/analytics', async (context) => {
	// total shorteners/redirections
	const [shorteners, redirectings] = await prismaClient.$transaction(
		async (prismaContext) => {
			const shorteners = await prismaContext.shortener.count();

			const redirectings = await prismaContext.analytic.count();

			return [shorteners, redirectings];
		},
	);

	return context.json(
		{
			shorteners,
			redirectings,
		},
		StatusCodes.OK,
	);
});
