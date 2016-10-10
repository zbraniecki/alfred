export class BaseCommand {
  constructor(api_url) {
    this.api_url = api_url;
  }

  execute(author, channel, str, test=false) {

  }

  revert() {

  }
}

BaseCommand.matches = function(str) {
  return false;
}
