import type { Request, Response, NextFunction } from 'express';
import { StatusCodes } from 'http-status-codes';

import { UpdateShortService } from '../services/update-short.service';

export class UpdateShortController {
  public constructor(
    private readonly services: UpdateShortService = new UpdateShortService()
  ) {}

  handle = async (request: Request, response: Response, next: NextFunction) => {
    const { id } = request.params as { id: string };

    const { href } = request.body as { href: string };

    try {
      const short = await this.services.execute(id, { href });

      return response.status(StatusCodes.OK).json(short);
    } catch (error: any) {
      return next(error);
    }
  };
}
