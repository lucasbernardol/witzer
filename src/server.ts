import { createServer } from 'node:http';
import process from 'node:process';
import type { Server as HttpServer } from 'node:http';

import { prismaClient } from './prisma';
import { app } from './app';

type SignalTerms = NodeJS.Signals | 'uncaughtException' | 'unhandledRejection';

const SIGNAL_TERMS: Array<SignalTerms> = [
  'SIGINT',
  'SIGTERM',
  'uncaughtException',
  'unhandledRejection',
];

export const PORT: number = Number(process.env?.PORT) || 3333;

export const Server: HttpServer = createServer(app);

export async function bootstrap(): Promise<HttpServer> {
  await prismaClient.$connect();

  const server = Server.listen(PORT, () => console.log(`\nPORT: ${PORT}`));

  SIGNAL_TERMS.forEach((term) => {
    process.on(term, () => {
      server.close(async () => {
        await prismaClient.$disconnect();

        process.exit(0);
      });
    });
  });

  return server;
}
