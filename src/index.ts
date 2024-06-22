import 'dotenv/config';

import { serve } from '@hono/node-server';
// import { env } from 'hono/adapter'

import app from './app';

const PORT = Number(process.env.PORT) || 3333;

serve({ fetch: app.fetch, port: PORT }, (info) =>
	console.log(`\nPORT: ${info.port}`),
);
