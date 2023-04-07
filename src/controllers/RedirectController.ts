import type { Request, Response, NextFunction } from 'express';
import { prismaClient } from '../prisma';

class RedirectController {
  async handle(request: Request, response: Response, next: NextFunction) {
    try {
      const { hash } = request.params as { hash: string };

      const shortened = await prismaClient.url.findUnique({
        where: {
          hash,
        },
        select: {
          id: true,
          href: true,
        },
      });

      if (!shortened) {
        return response.status(404).json({ message: 'Not found!' });
      }

      await prismaClient.statistic.create({
        select: { id: true },
        data: {
          urlId: shortened.id,
          userAgent: request.get('user-agent') ?? 'unknown',
        },
      });

      return response.redirect(shortened.href);
    } catch (error: any) {
      return next(error);
    }
  }
}

export { RedirectController };
