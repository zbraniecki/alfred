import React, { Component } from 'react';

import Report from  '../components/report/Report';
import { makeUpdate, get } from '../utils';

const { REACT_APP_API_URL } = process.env;

function byAuthorThenDate(a, b) {
  if (a.author !== b.author) {
    return a.author.localeCompare(b.author, 'en', { sensitivity: 'base' });
  }

  return a.createdAt - b.createdAt;
}

export default class ReportContainer extends Component {
  constructor(props) {
    super(props);

    const { year, month, day } = this.props.params;
    const reportSlug = `${year}-${month}-${day}`;

    this.state = {
      updates: [],
      reportSlug,
      prevReport: undefined,
      nextReport: undefined,
      reportDate: new Date(reportSlug)
    };
  }

  componentWillReceiveProps(nextProps) {
    const { year, month, day } = nextProps.params;
    const reportSlug = `${year}-${month}-${day}`;
    this._getReportData(reportSlug);
  }

  shouldComponentUpdate(nextProps, nextState) {
    return this.state.prevReport === undefined ||
      this.state.reportSlug !== nextState.reportSlug;
  }

  componentDidMount() {
    const { reportSlug } = this.state;
    this._getReportData(reportSlug);
  }

  _getReportData(reportSlug) {
    const url = `${REACT_APP_API_URL}/updates?report=${reportSlug}`;
    const url2 = `${REACT_APP_API_URL}/reports/${reportSlug}`;
    Promise.all([
      get(url),
      get(url2)
    ]).then(([updates, reports]) => {
      this.setState({
        reportSlug,
        reportDate: new Date(reportSlug),
        updates: updates.map(makeUpdate),
        prevReport: reports.prev,
        nextReport: reports.next
      }) 
    }).catch(console.error);
  }

  render() {
    const updatesByAuthor = this.state.updates.sort(byAuthorThenDate).reduce(
      (map, update) => map.set(
        update.author, (map.get(update.author) || []).concat(update)
      ), new Map()
    );

    const prevReportSlug = this.state.prevReport ?
      this.state.prevReport.slug : null;
    const nextReportSlug = this.state.nextReport ?
      this.state.nextReport.slug : null;

    return (
      <Report
        reportDate={this.state.reportDate}
        prevReportSlug={prevReportSlug}
        nextReportSlug={nextReportSlug}
        updatesByAuthor={updatesByAuthor}
      />
    );
  }
}
