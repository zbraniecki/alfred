import { Bot } from './bot';

const { ALFRED_URL, ALFRED_NAME, REACT_APP_API_URL} = process.env;

let bot = new Bot(ALFRED_URL, ALFRED_NAME, REACT_APP_API_URL);
bot.start();
