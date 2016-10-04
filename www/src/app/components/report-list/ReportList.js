import React from 'react';
import { Link } from 'react-router';

import { reportName } from '../../utils';

function ReportLink(props) {
  const { report: { slug, reportDate } } = props;
  const href = `/report/${slug}`;
  const name = reportName(reportDate);
  return (
    <li className="update">
      <Link to={href}>{name}</Link>
    </li>
  );
}

export default function ReportList(props) {
  const { isFetching, reports } = props;
  const content = isFetching ?
    <div className="tile__hint">Loading…</div> :
    <ul className="tile__updates">
      {reports.map(report => <ReportLink key={report.slug} report={report} />)}
    </ul>;

  return (
    <section className="tile">
      <h2 className="tile__title">Recent reports</h2>
      {content}
    </section>
  );
}
