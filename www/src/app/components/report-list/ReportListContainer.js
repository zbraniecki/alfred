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
    const { isFetching, recent, upcoming } = this.props;
    return (
      <ReportList
        isFetching={isFetching}
        recent={recent}
        upcoming={upcoming}
      />
    );
  }
}

const mapStateToProps = state => ({
  isFetching: state.reportList.isFetching,
  recent: state.reportList.recent,
  upcoming: state.reportList.upcoming
});

const mapDispatchToProps = {
  fetchReports: actions.fetchReports,
};

export default connect(mapStateToProps, mapDispatchToProps)(
  ReportListContainer
);

