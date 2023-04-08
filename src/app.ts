import type { Request, Response, NextFunction } from 'express';
import express from 'express';

import compression from 'compression';
import bodyParser from 'body-parser';

import helmet from 'helmet';
import cors from 'cors';
import limiter from 'express-rate-limit';

import morgan from 'morgan';
import hpp from 'hpp';

import { isHttpError, NotFound, TooManyRequests } from 'http-errors';
import type { HttpError } from 'http-errors';

import { errors } from 'celebrate';
import { routes } from './routes';

const globalLimiter = limiter({
  windowMs: 1 * 60 * 60 * 1000, // 1 hour
  max: 1000,
  legacyHeaders: false,
  standardHeaders: true,
  handler: (request, response, next) => next(new TooManyRequests()),
});

export const app = express();

app.use(compression());

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(helmet());
app.use(cors());

app.enable('trust proxy');

app.use(hpp());
app.use(morgan('dev'));

app.use(globalLimiter);

app.use(routes);
app.use(errors());

app.use((request, response, next) => next(new NotFound())); // Error: 404

app.use(
  (
    error: HttpError,
    request: Request,
    response: Response,
    next: NextFunction
  ) => {
    if (isHttpError(error)) {
      const { message, status, name } = error as HttpError;

      return response.status(status).json({ name, status, message });
    }

    console.error(error);

    return response.status(500).json({ message: 'Internal Server Error!' });
  }
);
