import { zValidator } from '@hono/zod-validator';
import { HTTPException } from 'hono/http-exception';
import { StatusCodes } from 'http-status-codes';
import { z } from 'zod';

import { AppRouterFactory } from '@factories/app-router.factory';

import { zodValidationHook } from '@utils/zod-validation-hook.util';
import { nanoid } from '@schemas/nanoid.schema';

export const shorterRedirectRoute = AppRouterFactory.createApp();

shorterRedirectRoute.get(
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

		if (shortener) {
			// Add queue
			return ctx.redirect(shortener, StatusCodes.MOVED_TEMPORARILY);
		}

		await next();
	},
	async (ctx) => {
		const { hash } = ctx.req.valid('param');

		const shortener = await ctx.var.prismaClient.shortener.findUnique({
			where: {
				hash,
			},
		});

		if (!shortener) {
			throw new HTTPException(StatusCodes.BAD_REQUEST, {
				message: 'Invalid hash!',
			});
		}

		await ctx.var.redis.set(hash, shortener.href, 'EX', 30 * 60);

		// Add analytocs to queue

		return ctx.redirect(shortener.href, StatusCodes.MOVED_TEMPORARILY);
	},
);
