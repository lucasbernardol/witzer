// prettier-ignore
import type { PrismaRepository, Url } from '../repositories/interfaces/PrismaRepository';
import { PrismaUrlRepository } from '../repositories/prisma-url.repository';
import { nanoid } from '../utils/nanoid.util';

export interface CreateShortServices {
  execute(props: Pick<Url, 'href'>): Promise<Url>;
}

export class CreateShortService implements CreateShortServices {
  public constructor(
    private readonly repository: PrismaRepository = new PrismaUrlRepository()
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
