// prettier-ignore
import type { IPrismaUrlRepository, Url } from '../repositories/interfaces/IPrismaUrlRepository';
import { PrismaUrlRepository } from '../repositories/prisma-url.repository';
import { nanoid } from '../utils/nanoid.util';

export interface CreateShortServices {
  execute(props: Pick<Url, 'href'>): Promise<Url>;
}

export class CreateShortService implements CreateShortServices {
  public constructor(
    private readonly repository: IPrismaUrlRepository = new PrismaUrlRepository()
  ) {}

  async execute({ href }: Pick<Url, 'href'>): Promise<Url> {
    const hash = await nanoid();

    const short = await this.repository.create({
      href,
      hash,
    });

    return short;
  }
}
