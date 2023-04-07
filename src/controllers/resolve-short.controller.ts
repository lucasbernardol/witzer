import type { Request, Response, NextFunction } from 'express';
import { StatusCodes } from 'http-status-codes';

import { RedirectShortService } from '../services/redirect-short.service';

export class ResolveShortController {
  public constructor(
    private readonly services: RedirectShortService = new RedirectShortService()
  ) {}

  handle = async (request: Request, response: Response, next: NextFunction) => {
    const { hash } = request.params as { hash: string };

    const { format } = request.query as { format: 'raw' | 'json' };
    try {
      const { href } = await this.services.execute({
        hash,
        userAgent: request.get('user-agent') ?? 'unknown',
      });

      if (format === 'json') {
        return response.status(StatusCodes.OK).json({ href });
      }

      return response.send(href);
    } catch (error: any) {
      return next(error);
    }
  };
}
