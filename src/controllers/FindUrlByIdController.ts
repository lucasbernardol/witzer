import type { Request, Response, NextFunction } from 'express';
import { prismaClient } from '../prisma';

class FindUrlByIdController {
  async handle(request: Request, response: Response, next: NextFunction) {
    try {
      const { id } = request.params as { id: string }; // uuid

      const shortened = await prismaClient.url.findUnique({
        where: {
          id,
        },
      });

      return response.json(shortened);
    } catch (error: any) {
      return next(error);
    }
  }
}

export { FindUrlByIdController };
