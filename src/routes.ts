import { Router } from 'express';
import limiter from 'express-rate-limit';
import { TooManyRequests } from 'http-errors';

import Joi from 'joi';
import { celebrate, Segments } from 'celebrate';

import { nanoId, Url, Uuid } from './schemas/types.schema';
import { reply } from './utils/reply.util';

import { FindShortsController } from './controllers/find-shorts.controller';
import { FindShortByIdController } from './controllers/find-short-by-id.controller';
import { RedirectShortController } from './controllers/redirect-short.controller';
import { ResolveShortController } from './controllers/resolve-short.controller';

import { StatisticsShortController } from './controllers/statistics.controller';
import { CreateShortController } from './controllers/create-short.controller';
import { DeleteShortController } from './controllers/delete-short.controller';
import { UpdateShortController } from './controllers/update-short.controller';

const routes = Router();

const resolveShortController = new ResolveShortController();
const redirectShortController = new RedirectShortController();

const findShortsController = new FindShortsController();
const findShortByIdController = new FindShortByIdController();
const createShortController = new CreateShortController();
const updateShortController = new UpdateShortController();
const deleteShortController = new DeleteShortController();

const statisticsShortController = new StatisticsShortController();

const createShortLimiter = limiter({
  windowMs: 30 * 60 * 1000, // 30 minutes
  max: 30,
  legacyHeaders: false,
  standardHeaders: true,
  handler: (request, response, next) => {
    return next(new TooManyRequests());
  },
});

const baseLimiter = limiter({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 30,
  legacyHeaders: false,
  standardHeaders: true,
  handler: (request, response, next) => {
    return next(new TooManyRequests());
  },
});

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
  resolveShortController.handle
);

routes.get(
  '/r/:hash',
  celebrate({
    [Segments.PARAMS]: Joi.object().keys({ hash: nanoId() }),
  }),
  redirectShortController.handle
);

routes.get(
  '/v1/shorts',
  celebrate({
    [Segments.QUERY]: {
      page: Joi.number().min(1).optional().default(1),
      limit: Joi.number().min(1).max(25).optional().default(25),
    },
  }),
  findShortsController.handle
);

routes.get(
  '/v1/shorts/:hash/stats',
  baseLimiter,
  celebrate({
    [Segments.PARAMS]: Joi.object().keys({ hash: nanoId() }),
  }),
  statisticsShortController.handle
);

routes.get(
  '/v1/shorts/:id',
  celebrate({ [Segments.PARAMS]: Joi.object().keys({ id: Uuid() }) }),
  findShortByIdController.handle
);

routes.post(
  '/v1/shorts',
  createShortLimiter,
  celebrate({ [Segments.BODY]: Joi.object().keys({ href: Url() }) }),
  createShortController.handle
);

routes.put(
  '/v1/shorts/:id',
  baseLimiter,
  celebrate({ [Segments.PARAMS]: Joi.object().keys({ id: Uuid() }) }),
  updateShortController.handle
);

routes.delete(
  '/v1/shorts/:id',
  baseLimiter,
  celebrate({ [Segments.PARAMS]: Joi.object().keys({ id: Uuid() }) }),
  deleteShortController.handle
);

export { routes };
