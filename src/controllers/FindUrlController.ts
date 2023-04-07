import type { Request, Response, NextFunction } from 'express';
import { prismaClient } from '../prisma';

class FindUrlController {
  async handle(request: Request, response: Response, next: NextFunction) {
    try {
      const shorteneds = await prismaClient.url.findMany();

      return response.json(shorteneds);
    } catch (error: any) {
      return next(error);
    }
  }
}

export { FindUrlController };
