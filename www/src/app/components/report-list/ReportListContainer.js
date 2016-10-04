import React, { Component } from 'react';
import { connect } from 'react-redux';
import * as actions from '../../actions';

import ReportList from './ReportList';

class ReportListContainer extends Component {
  componentWillMount() {
    const { fetchReports } = this.props;
    fetchReports();
  }

  render() {
    const { isFetching, reports } = this.props;
    return (
      <ReportList
        isFetching={isFetching}
        reports={reports}
      />
    );
  }
}

const mapStateToProps = state => ({
  isFetching: state.reportList.isFetching,
  reports: state.reportList.reports
});

const mapDispatchToProps = {
  fetchReports: actions.fetchReports,
};

export default connect(mapStateToProps, mapDispatchToProps)(
  ReportListContainer
);

