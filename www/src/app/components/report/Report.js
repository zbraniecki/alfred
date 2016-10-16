import React from 'react';
import { Link } from 'react-router';

import Footer from '../footer/Footer';
import UserReport from './UserReport';
import WikifyLink from './WikifyLink';

import { reportName, reportNameFromSlug } from '../../utils';

export default function Report(props) {
  const { reportDate, prevReportSlug, nextReportSlug, updatesByAuthor } = props;
  return (
    <div>

      <header className="header">
        <Link to="/" className="logo" />
        <h1 className="header__title">Report for {reportName(reportDate)}</h1>
      </header>
      <div className="navbar">
        {
          prevReportSlug
          ?
          <Link to={`/report/${prevReportSlug}`}>&lt; {reportNameFromSlug(prevReportSlug)}</Link>
          :
          <a></a>
        }
        {
          nextReportSlug
          ?
          <Link to={`/report/${nextReportSlug}`}>{reportNameFromSlug(nextReportSlug)} &gt;</Link>
          :
          null
        }
      </div>

      <div className="content content--tiles">
        {Array.from(updatesByAuthor).map(
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

      <Footer>
        <WikifyLink updatesByAuthor={updatesByAuthor}>
          Wikify this report
        </WikifyLink>
      </Footer>
    </div>
  );
}
