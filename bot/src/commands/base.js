export class BaseCommand {
  constructor(api_url) {
    this.api_url = api_url;
  }

  matches(str) {
    return false;
  }

  execute(author, channel, str, test=false) {

  }

  revert() {

  }
}
