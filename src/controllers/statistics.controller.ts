import type { Request, Response, NextFunction } from 'express';
import { StatusCodes } from 'http-status-codes';

import { StatisticsShortServices } from '../services/statistics-short.service';

export class StatisticsShortController {
  public constructor(
    private readonly services: StatisticsShortServices = new StatisticsShortServices()
  ) {}

  handle = async (request: Request, response: Response, next: NextFunction) => {
    const { hash } = request.params as { hash: string };

    try {
      const statistics = await this.services.execute(hash);

      return response.status(StatusCodes.OK).json({ statistics });
    } catch (error: any) {
      return next(error);
    }
  };
}
