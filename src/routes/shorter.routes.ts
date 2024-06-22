import { zValidator, Hook } from '@hono/zod-validator';
import { HTTPException } from 'hono/http-exception';
import { Hono } from 'hono';

import isURL from 'validator/lib/isURL';

import { StatusCodes } from 'http-status-codes';
import { z } from 'zod';

import { prismaClient } from '../prismaClient';
import { nanoid } from '../utils/nanoid.util';

export const shorts = new Hono();

const zodValidationHook: Hook<{}, any, any, {}> = (result, context) => {
	if (!result.success) {
		throw new HTTPException(StatusCodes.BAD_REQUEST, {
			message: result.error.errors[0].message,
			cause: result,
		});
	}
};

shorts.post(
	'/shorts',
	zValidator(
		'json',
		z
			.object({
				href: z
					.string()
					.url()
					.max(2048)
					.trim()
					.refine(
						(value) => {
							return isURL(value, {
								host_blacklist: [
									'localhost',
									'127.0.01',
									process.env.CURRENT_HOST,
									...process.env.BLACKLIST_HOSTS.split(','),
								],
							});
						},
						{ message: 'Invalid domain/host' },
					),
			})
			.required(),
		zodValidationHook,
	),
	async (context) => {
		const { href } = context.req.valid('json');

		const shorter = await prismaClient.shortener.create({
			data: {
				href,
				hash: nanoid(),
			},
		});

		return context.json(shorter, StatusCodes.CREATED);
	},
);
