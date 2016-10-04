import React from 'react';
import { Link } from 'react-router';

import UserReport from './UserReport';
import { reportName } from '../../utils';

export default function Report(props) {
  return (
    <div>

      <header className="header">
        <Link to="/" className="logo" />
        <h1 className="header__title">Report for {reportName(props.reportDate)}</h1>
      </header>

      <div className="content content--tiles">
        {Array.from(props.updatesByAuthor).map(
          ([author, updates]) =>
            <UserReport
              key={author}
              author={author}
              goals={updates.filter(up => up.status === 'goal')}
              struggles={updates.filter(up => up.status === 'struggle')}
              achievements={updates.filter(up => up.status === 'achievement')}
            />
        )}
      </div>
    </div>
  );
}
