import type { Request, Response, NextFunction } from 'express';

class CreateURLController {
  async handle(request: Request, response: Response, next: NextFunction) {
    try {
      const { href } = request.body as { href: string };

      return response.json({ href });
    } catch (error: any) {
      return next(error);
    }
  }
}

export { CreateURLController };
