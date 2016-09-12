import React, { Component } from 'react';

import Report from  './Report';
import { API_URL } from '../config';
import { get } from '../utils';

export default class ReportContainer extends Component {
  constructor(props) {
    super(props);

    const { year, month, day } = this.props.params;
    const report = `${year}-${month}-${day}`;

    this.state = {
      updates: [],
      report,
      reportDate: new Date(report)
    };
  }

  componentDidMount() {
    const { report } = this.state;
    const url = `${API_URL}/updates?report=${report}`;
    get(url).then(
      updates => this.setState({
        updates: updates.map(
          up => Object.assign(up, {
            reportDate: new Date(up.reportDate)
          })
        )
      })
    ).catch(
      err => console.log(err)
    );
  }

  render() {
    const updatesByAuthor = this.state.updates.reduce(
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
