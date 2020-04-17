import app from '@app/app';

import './config/db';

import { port } from './config';

app.listen(
  port, 
  () => console.log(`...Listening on PORT: ${ port }`)
);