import type { Request, Response, NextFunction } from 'express';
import { StatusCodes } from 'http-status-codes';

import { CreateShortService } from '../services/create-short.service';

export class CreateURLController {
  public constructor(
    private readonly services: CreateShortService = new CreateShortService()
  ) {}

  handle = async (request: Request, response: Response, next: NextFunction) => {
    try {
      const { href } = request.body as { href: string };

      const short = await this.services.execute({ href });

      return response.status(StatusCodes.CREATED).json(short);
    } catch (error: any) {
      return next(error);
    }
  };
}
