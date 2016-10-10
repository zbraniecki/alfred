import { get, post, log } from '../utils';

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

function describeTest(item) {
}

export const AddInboxItem = {
  matches: (str) => {
    return true;
  },

  execute: (api_url, author, channel, text, test=false) => {
    const update = {
      author,
      channel,
      status: 'inbox',
      resolved: false,
      text
    };
    return post(`${api_url}/updates`, update).then((resp) => {
      return post(`${api_url}/log`, Object.assign({
        id: resp
      }, update));
    }).then(
      () => randElem(CONFIRMATION_MESSAGES),
      () => randElem(ERROR_MESSAGES)
    );
  },

  test: (api_url, author, channel, text) => {
    return `The command will insert a new inbox item for author "${author}" with message "${text}"`;
  },

  revert: (str) => {

  }
};
