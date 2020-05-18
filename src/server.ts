import http from 'http';

import app from './app';
import './config/db';
import { socketServer } from './services/socket';
import { port } from './config';

const httpServer = http.createServer(app);
socketServer(httpServer);

httpServer.listen(
  port, 
  () => console.log(`...Listening on PORT: ${ port }`)
);