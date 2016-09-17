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
        handleIssue(db, payload);
        break;
      }
      case 'pull_request': {
        res.sendStatus(200);
        handlePullRequest(db, payload);
        break;
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
    action,
    issue: {
      number,
      title,
      user: {
        login
      }
    },
    repository: {
      full_name
    }
  } = payload;

  db.collection('users').findOne({github: login}).then(
    // only save if it's a known github user
    user => user ? saveUpdate(
      db, user.name, `/github/${full_name}`,
      `${action} issue #${number} in ${full_name}: ${title}`
    ) : null
  );
}

function handlePullRequest(db, payload) {
  const {
    action,
    pull_request: {
      number,
      title,
      user: {
        login
      }
    },
    repository: {
      full_name
    }
  } = payload;

  db.collection('users').findOne({github: login}).then(
    user => saveUpdate(
      db, user ? user.name : login, `/github/${full_name}`, 
      `${action} pull request #${number} in ${full_name}: ${title}`
    )
  );
}

function saveUpdate(db, author, channel, text) {
  return db.collection('updates').insert({
    author,
    channel,
    status: 'inbox',
    resolved: false,
    text,
    createdAt: new Date()
  });
}
