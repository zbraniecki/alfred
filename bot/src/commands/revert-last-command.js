import { get, post } from '../utils';
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

  matches: (str) => {
    return str === 'scratch that';
  },

  execute: (api_url, author, channel, text) => {
    return get(`${api_url}/log?author=${author}&channel=${channel}`).then(res => {
      if (res.length === 0) {
        return 'There is no command to revert';
      }
      let log = res[0];
      let Command = getCommandByName(log.command);
      if (Command === null) {
        return Promise.reject(`Unknown command ${log.command}.`);
      }
      if (!Command.revert) {
        return Promise.reject(`Can't revert a command of type ${log.command}.`);
      }
      return Command.revert(api_url, log.id).then(() => {
        return post(`${api_url}/log`, {
          command: RevertLastCommand.name,
          author: author,
          channel: channel,
          id: log.id
        });
      });
    }).then(
      () => 'Command reverted.',
      (err) => `Failed to revert the command: ${err}`
    );
  },

  test: (api_url, author, channel, text) => {
    return get(`${api_url}/log?author=${author}&channel=${channel}`).then(res => {
      if (res.length === 0) {
        return 'There is no command to revert';
      }
      let log = res[0];
      let ts = new Date(log.ts).toLocaleString();
      return `This command will revert the command of type "${log.command}" from ${ts}`;
    });
  },
}
