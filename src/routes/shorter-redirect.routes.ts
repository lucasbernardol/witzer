import { zValidator } from '@hono/zod-validator';
import { HTTPException } from 'hono/http-exception';
import { Hono } from 'hono';

import { StatusCodes } from 'http-status-codes';
import { z } from 'zod';

import { prismaClient } from '../prismaClient';

export const shorterRedirectRoute = new Hono();

shorterRedirectRoute.get(
	'/:hash',
	zValidator(
		'param',
		z.object({ hash: z.string().trim().min(8).max(8) }).required(),
		
	),
	async (context) => {
		const { hash } = context.req.valid('param');

		console.log(hash);

		const shortener = await prismaClient.shortener.findUnique({
			where: {
				hash,
			},
			select: {
				id: true,
				href: true,
			},
		});

		if (!shortener) {
			throw new HTTPException(StatusCodes.BAD_REQUEST, {
				message: 'Invalid shortener hash',
			});
		}

		// Analitics
		await prismaClient.$transaction(async (prismaContext) => {
			await prismaContext.analytic.create({
				data: {
					shortenerId: shortener.id,
					userAgent: context.req.header('User-Agent') ?? 'unknown',
				},
			});

			await prismaContext.shortener.update({
				where: {
					id: shortener.id,
				},
				data: {
					redirectings: {
						increment: 1,
					},
				},
			});
		});

		return context.redirect(shortener.href);
	},
);
