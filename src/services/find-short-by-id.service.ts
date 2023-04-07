import { NotFound } from 'http-errors';
import { PrismaUrlRepository } from '../repositories/prisma-url.repository';
import { IPrismaUrlRepository } from '../repositories/interfaces/IPrismaUrlRepository';

export class FindShortByIdService {
  public constructor(
    private readonly repository: IPrismaUrlRepository = new PrismaUrlRepository()
  ) {}

  async execute(shortId: string) {
    const short = await this.repository.findById(shortId);

    if (!short?.id) {
      throw new NotFound('Short not found!');
    }

    return short;
  }
}
