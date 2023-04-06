import { createServer } from 'node:http';
import { reply } from './utils/reply.util';

createServer(async (request, response) => {
  return response
    .writeHead(200, {
      'Content-type': 'application/json',
    })
    .end(JSON.stringify(reply()));
})
  .listen(3333)
  .on('listening', () => console.log('\nOK'));
