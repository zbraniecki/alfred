import React from 'react';

import UserReport from './UserReport';
import { reportName } from '../utils';

export default function Report(props) {
  return (
    <div>

      <header className="header">
        <div className="logo"></div>
        <h1 className="header__title">Report for {reportName(props.reportDate)}</h1>
      </header>

      <div className="content">
        {Array.from(props.updatesByAuthor).map(
          ([author, updates]) =>
            <UserReport
              key={author}
              author={author}
              report={props.report}
              todo={updates.filter(up => up.status === 'todo')}
              struggle={updates.filter(up => up.status === 'struggle')}
              done={updates.filter(up => up.status === 'done')}
            />
        )}
      </div>
    </div>
  );
}
