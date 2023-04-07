import { IPrismaUrlRepository } from '../repositories/interfaces/IPrismaUrlRepository';
import { PrismaUrlRepository } from '../repositories/prisma-url.repository';

export class FindManyShortsService {
  public constructor(
    private readonly repository: IPrismaUrlRepository = new PrismaUrlRepository()
  ) {}

  async execute({ current, take }: { current: number; take: number }) {
    const shorts = await this.repository.findMany({
      current,
      take,
    });

    return shorts;
  }
}
