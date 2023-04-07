import { createServer } from 'node:http';
import process from 'node:process';
import type { Server as HttpServer } from 'node:http';

import { prismaClient } from './prisma';
import { app } from './app';

export const PORT: number = Number(process.env?.PORT) || 3333;

export const Server: HttpServer = createServer(app);

export async function bootstrap(): Promise<HttpServer> {
  await prismaClient.$connect();

  return Server.listen(PORT, () =>
    console.log(`\nServer running on port: ${PORT}`)
  );
}
