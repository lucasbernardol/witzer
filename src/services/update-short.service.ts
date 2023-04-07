import { NotFound } from 'http-errors';

// prettier-ignore
import { IPrismaUrlRepository, Url } from '../repositories/interfaces/IPrismaUrlRepository';
import { PrismaUrlRepository } from '../repositories/prisma-url.repository';

export class UpdateShortService {
  public constructor(
    private readonly repository: IPrismaUrlRepository = new PrismaUrlRepository()
  ) {}

  async execute(shortId: string, { href }: Pick<Url, 'href'>) {
    const hasShort = await this.repository.hasById(shortId);

    if (!hasShort?.id) {
      throw new NotFound('Short not found!');
    }

    const short = await this.repository.update(shortId, { href });

    return short;
  }
}
