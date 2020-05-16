import app from '@app/app';

import http from 'http';
const httpServer = http.createServer(app);

import SocketServer from './services/socket-server';
new SocketServer(httpServer);

import './config/db';

import { port } from './config';

httpServer.listen(
  port, 
  () => console.log(`...Listening on PORT: ${ port }`)
);