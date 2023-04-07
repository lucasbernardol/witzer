import { createServer } from 'node:http';
import type { Server as HTTPServer } from 'node:http';

import { app } from './app';

const Server: HTTPServer = createServer(app);

Server.listen(process.env.PORT || 3333, () => console.log('\nOK'));
