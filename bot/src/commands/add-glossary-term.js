import { get, post, del } from '../utils';

const ERROR_MESSAGES = [
  'uh-oh, that didn\'t work out',
  'something went wrong'
];

function randElem(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

const defineRe = /define ([\w]+) as (.*)/;

export const AddGlossaryTerm = {
  name: 'AddGlossaryTerm',

  matches(str) {
    return str.startsWith('define ');
  },

  execute(bot, author, channel, text) {
    const [, term, desc] = defineRe.exec(text);

    return post(`${bot.api_url}/glossary`, { term, desc }, 'json').then(resp => {
      bot.logAction(author, channel, {
        command: AddGlossaryTerm.name,
        id: resp._id,
      });
    }).then(
      () => 'glossary term added',
      () => randElem(ERROR_MESSAGES)
    );
  },

  test(bot, author, channel, text) {
    const [, term, desc] = defineRe.exec(text);
    return `The command will add a new glossary term "${term}" with description "${desc}"`;
  },

  revert(bot, id) {
    return del(`${bot.api_url}/glossary/${id}`);
  }
};
