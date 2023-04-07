import type { Request, Response, NextFunction } from 'express';
import type { PrismaClientKnownRequestError } from '@prisma/client/runtime';
import { prismaClient } from '../prisma';

class StatisticsController {
  async handle(request: Request, response: Response, next: NextFunction) {
    const { hash } = request.params as { hash: string };

    try {
      const statistics = await prismaClient.$transaction(async (ctx) => {
        const short = await ctx.url.findUniqueOrThrow({
          where: {
            hash,
          },
        });

        const redirectings = await ctx.statistic.count({
          where: {
            urlId: short?.id,
          },
        });

        return {
          statistics: {
            redirectings,
            short,
          },
        };
      });

      return response.json(statistics);
    } catch (error: any) {
      const PrismaKnownError = error as PrismaClientKnownRequestError;

      if (PrismaKnownError.code === 'P2025') {
        return response.status(400).json({ message: 'Not found!' });
      }

      return next(error);
    }
  }
}

export { StatisticsController };
