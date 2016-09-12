import React from 'react';

import UserReport from './UserReport';
import { reportName } from '../utils';

export default function Report(props) {
  return (
    <div>

      <header>
        <div className="logo"></div>
        <h1>Report for {reportName(props.reportDate)}</h1>
      </header>

      <div>
        {Array.from(props.updatesByAuthor).map(
          ([author, updates]) =>
            <UserReport
              key={author}
              author={author}
              todo={updates.filter(up => up.status === 'todo')}
              struggle={updates.filter(up => up.status === 'struggle')}
              done={updates.filter(up => up.status === 'done')}
            />
        )}
      </div>
    </div>
  );
}
