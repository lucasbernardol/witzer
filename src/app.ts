import { HTTPException } from 'hono/http-exception';
import { cors } from 'hono/cors';
import { logger } from 'hono/logger';
import { secureHeaders } from 'hono/secure-headers';
import { Hono } from 'hono';

import { StatusCodes } from 'http-status-codes';

import { shorts } from './routes/shorter.routes';

import { shorterRedirectRoute } from './routes/shorter-redirect.routes';
import { AnalyticRoute } from './routes/analytics.routes';

const app = new Hono();

app.use(secureHeaders());

app.use(cors());

app.use(logger());

app.route('/r', shorterRedirectRoute);

app.route('/api', shorts);
app.route('/api', AnalyticRoute);

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

	return context.json(
		{
			error: {
				name: 'HTTPException',
				message: 'Internal Server Error',
				status: 500,
			},
		},
		StatusCodes.INTERNAL_SERVER_ERROR,
	);
});

export default app;
