import { get, post, del } from '../utils';

const ERROR_MESSAGES = [
  'uh-oh, that didn\'t work out',
  'something went wrong'
];

function randElem(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

const createDateRe = /create a report for ([0-9]{4}-[0-9]{2}-[0-9]{2})/;

export const CreateReport = {
  name: 'CreateReport',

  matches(str) {
    return str.startsWith('create a report for');
  },

  execute(bot, author, channel, text) {
    const [, slug] = createDateRe.exec(text);
    const ts = Date.parse(slug);

    if (isNaN(ts)) {
      return Promise.resolve(`that's not a valid date`);
    }

    return post(`${bot.api_url}/reports`, { date: slug }, 'json').then(resp => {
      bot.logAction(author, channel, {
        command: CreateReport.name,
        id: resp._id,
      });
    }).then(
      () => 'report created',
      () => randElem(ERROR_MESSAGES)
    );
  },

  test(bot, author, channel, text) {
    const [, slug] = createDateRe.exec(text);
    return `The command will create a new report for date ${slug}`;
  },

  revert(bot, id) {
    return del(`${bot.api_url}/reports/${id}`);
  }
};
