import React from 'react';
import { Link } from 'react-router';

import ReportListContainer
  from '../components/report-list/ReportListContainer';

export default function Home() {
  return (
    <div>

      <header className="header">
        <Link to="/" className="logo" />
        <h1 className="header__title">Alfred</h1>
      </header>

      <div className="content content--tiles">
        <div className="content__tile">
          <ReportListContainer />
        </div>

        <div className="content__tile">
          <section className="tile tile--notitle">
            <p>
              Alfred is an IRC bot and a status board used by
              the <a href="https://wiki.mozilla.org/L10n">Localization 
              Drivers</a> team at Mozilla.  It automatically tracks GitHub 
              issues and pull requests, and listens to IRC conversations.
            </p>
          </section>
        </div>

        <div className="content__tile"></div>
      </div>

    </div>
  );
}
