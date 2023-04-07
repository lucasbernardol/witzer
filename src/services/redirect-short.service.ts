import { NotFound } from 'http-errors';

import { IPrismaStatisticRepository } from '../repositories/interfaces/IPrismaStatisticRepository';
import { IPrismaUrlRepository } from '../repositories/interfaces/IPrismaUrlRepository';
import { PrismaStatisticRepository } from '../repositories/prisma-statistic.repository';
import { PrismaUrlRepository } from '../repositories/prisma-url.repository';

export class RedirectShortService {
  public constructor(
    private readonly repository: IPrismaUrlRepository = new PrismaUrlRepository(),
    private readonly statisticRepostirory: IPrismaStatisticRepository = new PrismaStatisticRepository()
  ) {}

  async execute({ hash, userAgent }: { hash: string; userAgent: string }) {
    const short = await this.repository.hasByHash(hash);

    if (!short?.id) {
      throw new NotFound('Short not found');
    }

    await this.statisticRepostirory.create({
      urlId: short.id,
      userAgent,
    });

    return { href: short.href };
  }
}
