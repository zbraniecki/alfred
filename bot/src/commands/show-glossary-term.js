import { get, post, del } from '../utils';

const ERROR_MESSAGES = [
  'uh-oh, that didn\'t work out',
  'something went wrong'
];

function randElem(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

const whatDoesRe = /what does ([\w]+) mean?/;

export const ShowGlossaryTerm = {
  name: 'ShowGlossaryTerm',

  matches(str) {
    return str.startsWith('what does ');
  },

  execute(bot, author, channel, text) {
    const [, term, desc] = whatDoesRe.exec(text);

    return get(`${bot.api_url}/glossary`, { term }, 'json').then(resp => {
      bot.logAction(author, channel, {
        command: ShowGlossaryTerm.name,
        id: resp._id,
      });
      return `${term} is ${desc}`;
    }, () => randElem(ERROR_MESSAGES));
  },

  test(bot, author, channel, text) {
    const [, term, desc] = whatDoesRe.exec(text);
    return `The command will look up "${term}" in our glossary`;
  }
};
