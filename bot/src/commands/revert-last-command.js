import { get, post } from '../utils';
import Commands from './index';

function getCommandByName(bot, name) {
  for (let Command of bot.commands) {
    if (Command.name === name) {
      return Command;
    }
  }
  return null;
}

export const RevertLastCommand = {
  name: 'RevertLastCommand',

  matches(str) {
    return str === 'undo';
  },

  execute(bot, author, channel, text) {
    const log = bot.getActionLog(author, channel);
    if (log.length === 0) {
      return Promise.resolve('There is no command to revert');
    }
    const entry = log[log.length - 1];

    let command = getCommandByName(bot, entry.object.command);
    if (command === null) {
      return Promise.resolve(`Unknown command ${log.command}.`);
    }
    if (!command.revert) {
      return Promise.resolve(`Can't revert a command of type ${entry.object.command}.`);
    }
    return command.revert(bot, entry.object.id).then(() => {
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
