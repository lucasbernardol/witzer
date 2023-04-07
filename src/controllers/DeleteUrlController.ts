import type { Request, Response, NextFunction } from 'express';
import { prismaClient } from '../prisma';

class DeleteUrlController {
  async handle(request: Request, response: Response, next: NextFunction) {
    try {
      const { id } = request.params as { id: string };

      const url = await prismaClient.url.findUnique({
        select: { id: true },
        where: {
          id,
        },
      });

      if (!url?.id) {
        return response.status(404).json({ message: 'Url does not exists!' });
      }

      await prismaClient.url.delete({
        select: { id: true },
        where: {
          id,
        },
      });

      return response.status(204).end();
    } catch (error: any) {
      return next(error);
    }
  }
}

export { DeleteUrlController };
