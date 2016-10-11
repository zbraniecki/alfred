import { post } from '../utils';
import { Commands } from './index';

function getCommandByName(name) {
  for (let Command of Commands) {
    if (Command.name === name) {
      return Command;
    }
  }
  return null;
}

export const RevertLastCommand = {
  name: 'revert-last-command',

  mathes: (str) => {
    return str === 'scratch that';
  },

  execute: (api_url, author, channel, text) => {
    return post(`${api_url}/log?author=${author}&channel=${channel}`).then(res => {
      let Command = getCommandByName(res.command);
      if (Command === null) {
        return Promise.reject(`Unknown command ${res.command}.`);
      }
      return Command.revert(res).then(() => {
        return `Reverted command ${res.command}.`;
      });
    });
  },

  test: (api_url, author, channel, text) => {
    return post(`${api_url}/log?author=${author}&channel=${channel}`).then(res => {
      return `This command will revert the command ${res}`;
    });
  },
}
