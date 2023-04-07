import type { Request, Response, NextFunction } from 'express';
import { StatusCodes } from 'http-status-codes';

import { FindShortByIdService } from '../services/find-short-by-id.service';

export class FindShortByIdController {
  public constructor(
    private readonly services: FindShortByIdService = new FindShortByIdService()
  ) {}

  handle = async (request: Request, response: Response, next: NextFunction) => {
    const { id } = request.params as { id: string }; // uuida

    try {
      const short = await this.services.execute(id);

      return response.status(StatusCodes.OK).json(short);
    } catch (error: any) {
      return next(error);
    }
  };
}
