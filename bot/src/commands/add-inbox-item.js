import { BaseCommand } from './base';
import { get, post } from '../utils';

const CONFIRMATION_MESSAGES = [
  'naturally',
  'of course',
  'splendid',
  'jolly good',
  'noted',
  'point taken',
  'at your service',
  'sounds good'
];

const ERROR_MESSAGES = [
  'uh-oh, that didn\'t work out',
  'something went wrong'
];

function randElem(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}


export class AddInboxItem extends BaseCommand {
  matches(str) {
    return true;
  }

  execute(author, channel, text, test=false) {
    const d = new Date();
    const update = {
      author,
      channel,
      status: 'inbox',
      resolved: false,
      text
    };
    return post(`${this.api_url}/updates`, update).then(
      () => randElem(CONFIRMATION_MESSAGES),
      () => randElem(ERROR_MESSAGES)
    );
    /*
    const d = new Date();
    return this.db.collection('updates').insertOne({
      author,
      channel,
      status: 'inbox',
      resolved: false,
      text,
      createdAt: d,
      firstCreatedAt: d,
    }).then(
      () => randElem(CONFIRMATION_MESSAGES),
      () => randElem(ERROR_MESSAGES)
    );
    */
  }

  revert(str) {

  }
}
