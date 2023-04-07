import type { Request, Response, NextFunction } from 'express';
import { StatusCodes } from 'http-status-codes';

import { FindManyShortsService } from '../services/find-many-shorts.service';

export class FindShortsController {
  public constructor(
    private readonly services: FindManyShortsService = new FindManyShortsService()
  ) {}

  handle = async (request: Request, response: Response, next: NextFunction) => {
    const { page, limit } = request.query as { page: any; limit: any };

    let current = Number(page) || 1;
    let take = Number(limit) || 5;

    if (current < 1) {
      current = 1;
    }

    if (take < 1) {
      take = 5;
    } else if (take > 25) {
      take = 25;
    }

    try {
      const shorts = await this.services.execute({
        current,
        take,
      });

      return response.status(StatusCodes.OK).json(shorts);
    } catch (error: any) {
      return next(error);
    }
  };
}
