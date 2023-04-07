import express from 'express';
import morgan from 'morgan';

import helmet from 'helmet';
import cors from 'cors';

//import limiter from 'express-rate-limit'
import hpp from 'hpp';

import { errors } from 'celebrate';
import { routes } from './routes';

export const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use(helmet());
app.use(cors());

app.use(hpp());
app.use(morgan('dev'));

app.use(routes);
app.use(errors());
