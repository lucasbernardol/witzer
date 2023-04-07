import type { Request, Response, NextFunction } from 'express';
import { prismaClient } from '../prisma';

class UpdateUrlController {
  async handle(request: Request, response: Response, next: NextFunction) {
    try {
      const { id } = request.params as { id: string };

      const { href } = request.body as { href: string };

      const shotened = await prismaClient.url.findUnique({
        where: {
          id,
        },
        select: {
          id: true,
        },
      });

      if (!shotened?.id) {
        return response.status(400).json({ message: 'Not found!' });
      }

      const shortenedUrl = await prismaClient.url.update({
        where: {
          id,
        },
        data: {
          href,
        },
      });

      return response.json(shortenedUrl);
    } catch (error: any) {
      return next(error);
    }
  }
}

export { UpdateUrlController };
