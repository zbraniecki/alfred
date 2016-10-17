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

  matches(str) {
    return str === 'scratch that';
  },

  execute(bot, author, channel, text) {
    const log = bot.getActionLog(author, channel);
    if (log.length === 0) {
      return Promise.resolve('There is no command to revert');
    }
    const entry = log[log.length - 1];

    let Command = getCommandByName(entry.object.command);
    if (Command === null) {
      return Promise.resolve(`Unknown command ${log.command}.`);
    }
    if (!Command.revert) {
      return Promise.resolve(`Can't revert a command of type ${entry.object.command}.`);
    }
    return Command.revert(bot, entry.object.id).then(() => {
      bot.logAction(author, channel, {
        command: RevertLastCommand.name,
        id: entry.object.id
      });
    }).then(
      () => 'Command reverted.',
      (err) => `Failed to revert the command: ${err}`
    );
  },

  test(bot, author, channel, text) {
    const log = bot.getActionLog(author, channel);
    if (log.length === 0) {
      return 'There is no command to revert';
    }
    const entry = log[log.length - 1];
    let ts = new Date(entry.ts).toLocaleString();
    return `This command will revert the command of type "${entry.object.command}" from ${ts}`;
  },
}
