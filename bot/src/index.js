import { MongoClient } from 'mongodb';
import { Bot } from './bot';

const { MONGO_URL, ALFRED_URL, ALFRED_NAME, REACT_APP_API_URL} = process.env;

MongoClient
  .connect(MONGO_URL)
  .then(db => {
    let bot = new Bot(ALFRED_URL, ALFRED_NAME, REACT_APP_API_URL, db);
    bot.start();
  }).catch(console.error);
