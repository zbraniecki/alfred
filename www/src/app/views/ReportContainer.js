import React, { Component } from 'react';

import Report from  '../components/report/Report';
import { makeUpdate, get } from '../utils';

const { REACT_APP_API_URL } = process.env;

function byAuthorThenDate(a, b) {
  if (a.author !== b.author) {
    return a.author < b.author;
  }

  return a.createdAt < b.createdAt;
}

export default class ReportContainer extends Component {
  constructor(props) {
    super(props);

    const { year, month, day } = this.props.params;
    const reportSlug = `${year}-${month}-${day}`;

    this.state = {
      updates: [],
      reportSlug,
      reportDate: new Date(reportSlug)
    };
  }

  componentDidMount() {
    const { reportSlug } = this.state;
    const url = `${REACT_APP_API_URL}/updates?report=${reportSlug}`;
    get(url).then(
      updates => this.setState({
        updates: updates.map(makeUpdate)
      })
    ).catch(console.error);
  }

  render() {
    const updatesByAuthor = this.state.updates.sort(byAuthorThenDate).reduce(
      (map, update) => map.set(
        update.author, (map.get(update.author) || []).concat(update)
      ), new Map()
    );

    return (
      <Report
        reportDate={this.state.reportDate}
        updatesByAuthor={updatesByAuthor}
      />
    );
  }
}
