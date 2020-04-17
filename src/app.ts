import express, { json } from 'express';
import path from 'path';
import cors from 'cors';

import './config';
import router from './config/router';

const app = express();

app.use(cors());
app.use(json());
app.use('/public', express.static(path.join('server/public')))

app.use('/', router);

export default app;