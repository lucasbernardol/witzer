import { zValidator } from '@hono/zod-validator';
import { env } from 'hono/adapter';

import { StatusCodes } from 'http-status-codes';
import { z } from 'zod';

import { AppRouterFactory } from '@factories/app-router.factory';
import { zodValidationHook } from '@utils/zod-validation-hook.util';

import { nanoid } from '@utils/nanoid.util';
import { url } from '@schemas/url.schema';

export const ShorternersRoute = AppRouterFactory.createApp();

ShorternersRoute.post(
	'/shorts',
	zValidator(
		'json',
		z
			.object({
				href: url(),
			})
			.required(),
		zodValidationHook,
	),
	async (ctx) => {
		const { href } = ctx.req.valid('json');

		const { HOST = 'http://localhost:3333' } = env<{ HOST: string }>(ctx);

		const hash = await nanoid();

		const shorter = await ctx.var.prismaClient.shorterner.create({
			data: {
				href,
				hash,
			},
		});

		// Remove analytics caching
		await ctx.var.redis.del('analytics');

		// Add current shortener to cache
		await ctx.var.redis.set(
			hash,
			JSON.stringify({ href: shorter.href, shorternerId: shorter.id }),
			'EX',
			5 * 60, // 5 minutes
		);

		return ctx.json(
			{
				code: shorter.hash,
				href: `${HOST}/r/${shorter.hash}`,
			},
			StatusCodes.CREATED,
		);
	},
);
