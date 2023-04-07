import { NotFound } from 'http-errors';

import { IPrismaUrlRepository } from '../repositories/interfaces/IPrismaUrlRepository';
import { PrismaUrlRepository } from '../repositories/prisma-url.repository';

export class DeleteShortService {
  public constructor(
    private readonly repository: IPrismaUrlRepository = new PrismaUrlRepository()
  ) {}

  async execute(shortId: string): Promise<void> {
    const short = await this.repository.hasById(shortId);

    if (!short?.id) {
      throw new NotFound('Short not found!');
    }

    await this.repository.delete(shortId);
  }
}
