import { Router } from 'express';

import { FindUrlController } from './controllers/FindUrlController';
import { FindUrlByIdController } from './controllers/FindUrlByIdController';
import { CreateURLController } from './controllers/CreateUrlController';
import { DeleteUrlController } from './controllers/DeleteUrlController';

import { reply } from './utils/reply.util';
import { UpdateUrlController } from './controllers/UpdateUrlController';

const routes = Router();

const createUrlController = new CreateURLController();
const findUrlController = new FindUrlController();
const findUrlByIdController = new FindUrlByIdController();
const deleteUrlController = new DeleteUrlController();
const updateUrlController = new UpdateUrlController();

routes.get('/', async (request, response, next) => {
  try {
    return response.json(reply());
  } catch (error: any) {
    return next(error);
  }
});

//routes.param('id', (request, response, next, param) => {});

routes.get('/v1/urls', findUrlController.handle);
routes.get('/v1/urls/:id', findUrlByIdController.handle);
routes.post('/v1/urls', createUrlController.handle);
routes.put('/v1/urls/:id', updateUrlController.handle);
routes.delete('/v1/urls/:id', deleteUrlController.handle);

export { routes };
