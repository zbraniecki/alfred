import React from 'react';
import { Link } from 'react-router';

export default function Home() {
  return (
    <div>

      <header className="header">
        <Link to="/" className="logo" />
        <h1 className="header__title">Alfred</h1>
      </header>

      <div className="content content--tiles">
        <div className="content__column">
          <section className="tile">
            <p>
              Alfred is an IRC bot and a status board used by the Localization 
              Drivers team at Mozilla.  It automatically tracks GitHub issues 
              and pull requests, and listens to IRC conversations.
            </p>
          </section>
        </div>
      </div>

    </div>
  );
}
