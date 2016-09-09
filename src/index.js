import { MongoClient } from 'mongodb';
import { createBot } from './bot';

MongoClient
  .connect(process.env.MONGO_URL)
  .then(createBot)
  .catch(console.error);
