import { Router } from 'express';
import Joi from 'joi';
import { celebrate, Segments } from 'celebrate';

import { ResolveHashToUrlController } from './controllers/ResolveHashToUrlController';
import { FindUrlController } from './controllers/FindUrlController';
import { FindUrlByIdController } from './controllers/FindUrlByIdController';
import { CreateURLController } from './controllers/CreateUrlController';
import { UpdateUrlController } from './controllers/UpdateUrlController';
import { DeleteUrlController } from './controllers/DeleteUrlController';

import { nanoId, Url, Uuid } from './schemas/types.schema';
import { reply } from './utils/reply.util';
import { RedirectController } from './controllers/RedirectController';
import { StatisticsController } from './controllers/StatisticsController';

const routes = Router();

const createUrlController = new CreateURLController();
const findUrlController = new FindUrlController();
const findUrlByIdController = new FindUrlByIdController();
const deleteUrlController = new DeleteUrlController();
const updateUrlController = new UpdateUrlController();
const statisticsController = new StatisticsController();

const redirectController = new RedirectController();
const resolveController = new ResolveHashToUrlController();

routes.get('/', async (request, response, next) => {
  try {
    return response.json(reply());
  } catch (error: any) {
    return next(error);
  }
});

//routes.param('id', (request, response, next, param) => {});

routes.get(
  '/d/:hash',
  celebrate({
    [Segments.PARAMS]: Joi.object().keys({ hash: nanoId() }),
    [Segments.QUERY]: Joi.object().keys({
      format: Joi.string()
        .trim()
        .lowercase()
        .valid(...['raw', 'json'])
        .optional()
        .default('json'),
    }),
  }),
  resolveController.handle
);

routes.get(
  '/r/:hash',
  celebrate({
    [Segments.PARAMS]: Joi.object().keys({ hash: nanoId() }),
  }),
  redirectController.handle
);

routes.get('/v1/urls', findUrlController.handle);

routes.get('/v1/urls/:hash/stats', statisticsController.handle);

routes.get(
  '/v1/urls/:id',
  celebrate({ [Segments.PARAMS]: Joi.object().keys({ id: Uuid() }) }),
  findUrlByIdController.handle
);

routes.post(
  '/v1/urls',
  celebrate({ [Segments.BODY]: Joi.object().keys({ href: Url() }) }),
  createUrlController.handle
);

routes.put(
  '/v1/urls/:id',
  celebrate({ [Segments.PARAMS]: Joi.object().keys({ id: Uuid() }) }),
  updateUrlController.handle
);

routes.delete(
  '/v1/urls/:id',
  celebrate({ [Segments.PARAMS]: Joi.object().keys({ id: Uuid() }) }),
  deleteUrlController.handle
);

export { routes };
