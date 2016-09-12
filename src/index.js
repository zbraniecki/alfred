import { MongoClient } from 'mongodb';
import { createServer } from './server';

MongoClient
  .connect(process.env.MONGO_URL)
  .then(createServer)
  .catch(console.error);
