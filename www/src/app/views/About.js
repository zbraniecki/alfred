import React from 'react';
import { WEBHOOK_URL } from '../../config';

export default function About() {
  return (
    <div>

      <header className="header">
        <div className="logo logo"></div>
        <h1 className="header__title">About Alfred</h1>
      </header>

      <div className="content">
        <div className="content__column">
          <section className="tile">
            <p>
              Alfred is an IRC bot and a status board. It automatically tracks 
              GitHub issues and pull requests, and listens to IRC conversations. 
            </p>

            <h3 className="tile__subtitle">Open-source</h3>
            <p>
              Alfred is open-source.  You can view and contribute to the code 
              at <a href="https://github.com/stasm/alfred">stasm/alfred</a>.  
              Consult the current roadmap and report bugs on 
              the <a href="https://github.com/stasm/alfred/projects">project board</a>.  
              For a more real-time interaction join 
              the <a href="irc://irc.mozilla.org/alfred">#alfred</a> channel on 
              irc.mozilla.org.
            </p>

            <h3 className="tile__subtitle">Webhook</h3>
            <p>
              Making Alfred know about the issues and pull request acticity in 
              your repo is easy.  On GitHub, go to <em>Settings</em> 
              → <em>Webhooks</em> and create a new webhook using the following 
              <em>Payload URL</em>:
            </p>

            <blockquote>
              <p>
                <code>{WEBHOOK_URL}/github</code>
              </p>
            </blockquote>

            <p>
              Currently Alfred supports the <code>issues</code> and 
              the <code>pull_request</code> events.
            </p>
          </section>
        </div>
      </div>

    </div>
  );
}
