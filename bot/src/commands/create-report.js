import { get, post } from '../utils';

const ERROR_MESSAGES = [
  'uh-oh, that didn\'t work out',
  'something went wrong'
];

function randElem(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

const createDateRe = /create a report for ([0-9]{4}-[0-9]{2}-[0-9]{2})/;

export const CreateReport = {
  name: 'create-report',

  matches: (str) => {
    return str.startsWith('create a report for');
  },

  execute: (api_url, author, channel, text) => {
    const [, slug] = createDateRe.exec(text);
    const ts = Date.parse(slug);

    if (isNaN(ts)) {
      return Promise.resolve(`that's not a valid date`);
    }

    let obj = {
      date: slug
    }

    return post(`${api_url}/reports`, obj, 'json').then(resp => {
      return post(`${api_url}/log`, {
        command: CreateReport.name,
        author: author,
        channel: channel,
        id: resp,
        object: obj
      });
    }).then(
      () => 'report created',
      () => randElem(ERROR_MESSAGES)
    );
  },

  test: (api_url, author, channel, text) => {
    const [, slug] = createDateRe.exec(text);
    return `The command will create a new report for date ${slug}`;
  },

  revert: (api_url, id) => {
    return post(`${api_url}/reports/remove/${id}`);
  }
};
