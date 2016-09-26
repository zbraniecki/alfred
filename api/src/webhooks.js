import express from 'express';
import bodyParser from 'body-parser';
import createGitHubMiddleware from 'github-webhook-middleware';

const { GITHUB_SECRET } = process.env;
const gh = createGitHubMiddleware({
  secret: GITHUB_SECRET
});

export default function createRouter(db) {
  const router = express.Router();
  router.use(bodyParser.json());
  router.route('/github').post(gh, createGitHubWebhook(db))
  return router;
}

function createGitHubWebhook(db) {
  return function(req, res, next) {
    const payload = req.body;

    switch (req.headers['x-github-event']) {
      case 'ping': {
        console.log(payload);
        return res.sendStatus(200);
      }
      case 'issues': {
        res.sendStatus(200);
        return handleIssue(db, payload);
      }
      case 'pull_request': {
        res.sendStatus(200);
        return handlePullRequest(db, payload);
      }
      default: {
        console.log(req.headers['x-github-event']);
        return res.sendStatus(200);
      }
    }
  }
}

function handleIssue(db, payload) {
  const {
    sender: { login },
    repository: { full_name }
  } = payload;

  const message = getIssueEventMessage(payload);

  if (!message) {
    return;
  }

  return db.collection('users').findOne({github: login}).then(
    user => user ? saveUpdate(
      db, user.name, `/github/${full_name}`, message
    ) : null
  ).catch(console.error);
}

function getIssueEventMessage(payload) {
  const {
    action,
    issue: { number, title },
    repository: { full_name }
  } = payload;

  switch (action) {
    case 'opened':
    case 'closed':
    case 'reopened':
      return `${action} issue #${number} in ${full_name}: ${title}`;
    default:
      return null;
  }
}

function handlePullRequest(db, payload) {
  const {
    sender: { login },
    repository: { full_name }
  } = payload;

  const message = getPullRequestEventMessage(payload);

  if (!message) {
    return;
  }

  return db.collection('users').findOne({github: login}).then(
    user => user ? saveUpdate(
      db, user.name, `/github/${full_name}`, message
    ) : null
  ).catch(console.error);
}

function getPullRequestEventMessage(payload) {
  const {
    action,
    pull_request: { number, title, merged },
    repository: { full_name }
  } = payload;

  switch (action) {
    case 'opened':
    case 'reopened':
      return `${action} pull request #${number} in ${full_name}: ${title}`;
    case 'closed': {
      const actn = merged ? 'merged' : 'closed';
      return `${actn} pull request #${number} in ${full_name}: ${title}`;
    }
    default:
      return null;
  }
}

function saveUpdate(db, author, channel, text) {
  return db.collection('updates').insert({
    author,
    channel,
    status: 'event',
    resolved: false,
    text,
    createdAt: new Date()
  });
}
