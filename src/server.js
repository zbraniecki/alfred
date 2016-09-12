import express from 'express';
import morgan from 'morgan';

import { createRouter } from './router';

export function createServer(db) {
  const app = express();

  app.use(morgan('combined'))
  app.use('/', createRouter(db));

  const server = app.listen(process.env.PORT, function() {
    console.log('Express is listening to http://localhost:' + process.env.PORT);
  });

  function cleanup() {
    server.close(function() {
      db.close();
      process.exit();
    });

    setTimeout(function() {
      console.error("Could not close connections in time, forcing shut down");
      process.exit(1);
    }, 1 * 1000);
  }

  process.on('SIGINT', cleanup);
  process.on('SIGTERM', cleanup);
}
