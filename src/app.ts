import process from 'node:process';

import { Hono } from 'hono';
import { HTTPException } from 'hono/http-exception';

import { cors } from 'hono/cors';
import { csrf } from 'hono/csrf';

import { secureHeaders } from 'hono/secure-headers';
import { logger } from 'hono/logger';

import { StatusCodes } from 'http-status-codes';

import { ShorternerRedirectRoute } from './routes/shorter-redirect.routes';
import { ShorternersRoute } from './routes/shorter.routes';
import { AnalyticsRoute } from './routes/analytics.routes';

import pkg from '../package.json';

const app = new Hono();

app.use(csrf());
app.use(secureHeaders());

app.use(cors());
app.use(logger());

app.get('/', async (ctx) => {
	const { version } = pkg;

	const uptime = Math.floor(process.uptime());

	return ctx.json({ version, uptime }, StatusCodes.OK);
});

app.route('/r', ShorternerRedirectRoute);

app.route('/api', ShorternersRoute);
app.route('/api', AnalyticsRoute);

app.use(async (ctx, _next) => {
	// Throw not found error;
	throw new HTTPException(StatusCodes.NOT_FOUND, { message: 'Not found' });
});

app.onError(async (error, context) => {
	if (error instanceof HTTPException) {
		return context.json(
			{
				error: {
					name: error.name,
					message: error.message,
					status: error.status,
				},
			},
			error.status,
		);
	}

	console.log(error);

	return context.json(
		{
			error: {
				name: 'Error',
				message: 'Internal Server Error',
				status: 500,
			},
		},
		StatusCodes.INTERNAL_SERVER_ERROR,
	);
});

export default app;
