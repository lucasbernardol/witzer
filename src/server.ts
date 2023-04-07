import { createServer } from 'node:http';
import process from 'node:process';
import type { Server as HttpServer } from 'node:http';

import { prismaClient } from './prisma';
import { app } from './app';

const TERMS: string[] = [
  'SIGINT',
  'SIGKILL',
  'SIGBREAK',
  'uncaughtException',
  'unhandledRejection',
];

export const PORT: number = Number(process.env?.PORT) || 3333;

export const Server: HttpServer = createServer(app);

export async function bootstrap(): Promise<HttpServer> {
  await prismaClient.$connect();

  const server = Server.listen(PORT, () =>
    console.log(`\nServer running on port: ${PORT}`)
  );

  TERMS.forEach((term) => {
    process.on(term, () => {
      console.log(`Term: ${term}\n`);
      server.close(async () => {
        await prismaClient.$disconnect();

        process.exit(0);
      });
    });
  });

  return server;
}
