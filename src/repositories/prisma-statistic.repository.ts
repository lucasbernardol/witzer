import { prismaClient } from '../prisma';
import { IPrismaStatisticRepository } from './interfaces/IPrismaStatisticRepository';

type CreateStatisticProps = {
  urlId: string;
  userAgent: string;
};

export class PrismaStatisticRepository implements IPrismaStatisticRepository {
  async create({ urlId, userAgent }: CreateStatisticProps): Promise<void> {
    await prismaClient.statistic.create({
      data: {
        urlId,
        userAgent,
      },
    });
  }
}
