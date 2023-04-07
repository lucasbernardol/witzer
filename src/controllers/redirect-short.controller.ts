import type { Request, Response, NextFunction } from 'express';
import { StatusCodes } from 'http-status-codes';

import { RedirectShortService } from '../services/redirect-short.service';

export class RedirectShortController {
  public constructor(
    private readonly services: RedirectShortService = new RedirectShortService()
  ) {}

  handle = async (request: Request, response: Response, next: NextFunction) => {
    const { hash } = request.params as { hash: string };

    try {
      const { href } = await this.services.execute({
        hash,
        userAgent: request.get('user-agent') ?? 'unknown',
      });

      return response.status(StatusCodes.MOVED_PERMANENTLY).redirect(href);
    } catch (error: any) {
      return next(error);
    }
  };
}
