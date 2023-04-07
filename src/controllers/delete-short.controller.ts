import type { Request, Response, NextFunction } from 'express';
import { StatusCodes } from 'http-status-codes';

import { DeleteShortService } from '../services/delete-short.service';

export class DeleteShortController {
  public constructor(
    private readonly services: DeleteShortService = new DeleteShortService()
  ) {}

  handle = async (request: Request, response: Response, next: NextFunction) => {
    const { id } = request.params as { id: string };

    try {
      await this.services.execute(id);

      return response.status(StatusCodes.NO_CONTENT).end();
    } catch (error: any) {
      return next(error);
    }
  };
}
