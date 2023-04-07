import { prismaClient } from '../prisma';

import {
  Url,
  CreateUrlProps,
  PrismaRepository,
} from './interfaces/PrismaRepository';

class PrismaUrlRepository implements PrismaRepository {
  public constructor() {}

  async create({ href, hash }: CreateUrlProps): Promise<Url> {
    const short = await prismaClient.url.create({
      data: {
        href,
        hash,
      },
      //select: {}
    });

    return short as Url;
  }
}

export { PrismaUrlRepository };
