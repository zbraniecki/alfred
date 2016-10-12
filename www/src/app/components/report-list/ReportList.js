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

function ReportListTile(props) {
  const { title, reports } = props;
  return (
    <section className="tile">
      <h2 className="tile__title">{ title }</h2>
      <ul className="tile__updates">
        {reports.map(report => <ReportLink key={report.slug} report={report} />)}
      </ul>
    </section>
  );
}

export default function ReportList(props) {
  const { isFetching, recent, upcoming } = props;

  if (isFetching) {
    return (
      <section className="tile">
        <h2 className="tile__title">Recent reports</h2>
        <div className="tile__hint">Loading…</div>
      </section>
    );
  }

  if (upcoming.length === 0) {
    return <ReportListTile title="Recent reports" reports={recent} />;
  }

  return (
    <div>
      <ReportListTile title="Upcoming report" reports={upcoming} />
      <ReportListTile title="Recent reports" reports={recent} />
    </div>
  );

}
