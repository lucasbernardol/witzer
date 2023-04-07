import type { Request, Response, NextFunction } from 'express';

import { prismaClient } from '../prisma';
import { nanoid } from '../utils/nanoid.util';

class CreateURLController {
  public constructor() {}

  async handle(request: Request, response: Response, next: NextFunction) {
    try {
      const { href } = request.body as { href: string };

      const hash = await nanoid();

      const shortened = await prismaClient.url.create({
        data: {
          href,
          hash,
        },
      });

      return response.json(shortened);
    } catch (error: any) {
      return next(error);
    }
  }
}

export { CreateURLController };
