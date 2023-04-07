import { Router } from 'express';

import { CreateURLController } from './controllers/CreateUrlController';
import { reply } from './utils/reply.util';

const routes = Router();

const createUrlController = new CreateURLController();

routes.get('/', async (request, response, next) => {
  try {
    return response.json(reply());
  } catch (error: any) {
    return next(error);
  }
});

routes.post('/v1/urls', createUrlController.handle);

export { routes };
