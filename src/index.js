import { MongoClient } from 'mongodb';
import { createBot } from './bot';
import { createServer } from './server';

MongoClient
  .connect(process.env.MONGO_URL)
  .then(start)
  .catch(console.error);

function start(db) {
  createBot(db);
  createServer(db);
}
