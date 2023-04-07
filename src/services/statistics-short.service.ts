import type { PrismaClientKnownRequestError } from '@prisma/client/runtime';
import { NotFound } from 'http-errors';
import { prismaClient } from '../prisma';

export class StatisticsShortServices {
  public constructor() {}

  async execute(hash: string) {
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

        return { redirectings, short };
      });

      return statistics;
    } catch (error: any) {
      const PrismaKnownError = error as PrismaClientKnownRequestError;

      if (PrismaKnownError.code === 'P2025') {
        throw new NotFound('Short not found!');
      }

      throw error; // stack
    }
  }
}
