import { MongoClient } from 'mongodb';
import { createBot } from './bot';

const { MONGO_URL, ALFRED_URL, ALFRED_NAME} = process.env;

MongoClient
  .connect(MONGO_URL)
  .then(db => createBot(ALFRED_URL, ALFRED_NAME, db))
  .catch(console.error);
