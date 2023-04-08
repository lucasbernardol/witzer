import { prismaClient } from '../prisma';

import {
  Url,
  CreateUrlProps,
  IPrismaUrlRepository,
  hasByHashProps,
} from './interfaces/IPrismaUrlRepository';

export class PrismaUrlRepository implements IPrismaUrlRepository {
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

  async findMany({
    current,
    take,
  }: {
    current: number;
    take: number;
  }): Promise<{ data: Url[]; meta: Record<string, any> }> {
    let currentPage = current;

    const total = await prismaClient.url.count();

    const pages = Math.max(1, Math.ceil(total / take));

    if (currentPage > pages) {
      currentPage = pages;
    }

    const skip = currentPage === 1 ? 0 : (currentPage - 1) * take;

    const shorts = await prismaClient.url.findMany({
      take,
      skip,
      orderBy: {
        createdAt: 'desc',
      },
    });

    const hasNext = current < pages;

    const hasPrevious = current > 1;

    return {
      data: shorts,
      meta: {
        total,
        take,
        pages,
        current: currentPage,
        next: hasNext ? currentPage + 1 : null,
        previous: hasPrevious ? currentPage - 1 : null,
        // hasNext,
        // hasPrevious,
        length: shorts.length,
      },
    };
  }

  async findById(id: string): Promise<Url | null> {
    const short = await prismaClient.url.findUnique({
      where: {
        id,
      },
    });

    return short;
  }

  async hasById(id: string) {
    const short = await prismaClient.url.findUnique({
      where: {
        id,
      },
      select: {
        id: true,
      },
    });

    return short as any;
  }

  async hasByHash(hash: string): Promise<hasByHashProps | null> {
    const short = await prismaClient.url.findUnique({
      where: {
        hash,
      },
      select: {
        id: true,
        href: true,
      },
    });

    return short;
  }

  async update(id: string, { href }: Pick<Url, 'href'>): Promise<Url> {
    const short = await prismaClient.url.update({
      where: {
        id,
      },
      data: {
        href,
      },
    });

    return short;
  }

  async delete(id: string) {
    await prismaClient.url.delete({
      select: { id: true },
      where: {
        id,
      },
    });
  }
}
