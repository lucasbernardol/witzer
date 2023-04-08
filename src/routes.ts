import { Router } from 'express';
import { StatusCodes } from 'http-status-codes';
import { celebrate } from 'celebrate';

import { FindShortsController } from './controllers/find-shorts.controller';
import { FindShortByIdController } from './controllers/find-short-by-id.controller';
import { RedirectShortController } from './controllers/redirect-short.controller';
import { ResolveShortController } from './controllers/resolve-short.controller';

import { StatisticsShortController } from './controllers/statistics.controller';
import { CreateShortController } from './controllers/create-short.controller';
import { DeleteShortController } from './controllers/delete-short.controller';
import { UpdateShortController } from './controllers/update-short.controller';

import Joi from './schemas/joi-validators.schema';
import { reply } from './utils/reply.util';

const routes = Router();

const resolveController = new ResolveShortController();
const redirectController = new RedirectShortController();
const statisticsController = new StatisticsShortController();

const findController = new FindShortsController();
const findByIdController = new FindShortByIdController();
const createController = new CreateShortController();
const updateController = new UpdateShortController();
const deleteController = new DeleteShortController();

routes.get('/', async (request, response, next) => {
  try {
    return response.status(StatusCodes.OK).json(reply());
  } catch (error: any) {
    return next(error);
  }
});

routes.get(
  '/r/:hash',
  celebrate({
    params: Joi.NanoIdParam(),
  }),
  redirectController.handle
);

routes.get(
  '/d/:hash',
  celebrate({
    params: Joi.NanoIdParam(),
    query: Joi.FormatQueryParams(),
  }),
  resolveController.handle
);

/**
 * Path: "/v1/shorts"
 */
routes.get(
  '/v1/shorts',
  celebrate({
    query: Joi.PagePageSizeQueryParams(),
  }),
  findController.handle
);

routes.get(
  '/v1/shorts/:hash/stats',
  celebrate({
    params: Joi.NanoIdParam(),
  }),
  statisticsController.handle
);

routes.get(
  '/v1/shorts/:id',
  celebrate({
    params: Joi.UuidParam(),
  }),
  findByIdController.handle
);

routes.post(
  '/v1/shorts',
  celebrate({
    body: Joi.UrlParam(),
  }),
  createController.handle
);

routes.put(
  '/v1/shorts/:id',
  celebrate({
    params: Joi.UuidParam(),
  }),
  updateController.handle
);

routes.delete(
  '/v1/shorts/:id',
  celebrate({
    params: Joi.UuidParam(),
  }),
  deleteController.handle
);

export { routes };
