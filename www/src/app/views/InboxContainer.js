import React, { Component } from 'react';

import Inbox from '../components/inbox/Inbox';
import { API_URL } from '../../config';
import { makeUpdate, get, post } from '../utils';

export default class InboxContainer extends Component {
  constructor(props) {
    super(props);

    const { author } = this.props.params;

    this.state = {
      author,
      updates: [],
      prevReportDate: new Date(),
      nextReportDate: new Date(),
      nextReportSlug: ''
    };

    this.handleTextChange = this.handleTextChange.bind(this);

    this.handleStartEdit = this.handleStartEdit.bind(this);
    this.handleCancelEdit = this.handleCancelEdit.bind(this);
    this.handleSubmitEdit = this.handleSubmitEdit.bind(this);

    this.handleStartAdd = this.handleStartAdd.bind(this);
    this.handleCancelAdd = this.handleCancelAdd.bind(this);
    this.handleSubmitAdd = this.handleSubmitAdd.bind(this);

    this.handleResolve = this.handleResolve.bind(this);
    this.handleArchive = this.handleArchive.bind(this);
  }

  componentDidMount() {
    const { author } = this.state;
    const currentReportsInfo = `${API_URL}/reports/current`;
    const updatesByAuthor = `${API_URL}/updates?author=${author}`;

    get(currentReportsInfo).then(
      ([prevReport, nextReport]) => Promise.all([
        prevReport, nextReport,
        get(`${updatesByAuthor}&resolved=0&status=inbox&status=event&status=todo&status=done`),
        get(`${updatesByAuthor}&resolved=0&status=goal&before=${nextReport.slug}`),
        get(`${updatesByAuthor}&report=${nextReport.slug}&status=goal&status=struggle&status=achievement`),
      ])
    ).then(
      ([prevReport, nextReport, current, prev, next]) => this.setState({
        prevReportDate: new Date(prevReport.reportDate),
        nextReportDate: new Date(nextReport.reportDate),
        nextReportSlug: nextReport.slug,
        updates: [...current, ...prev, ...next].map(makeUpdate)
      })
    ).catch(console.error);
  }

  handleStartEdit(update) {
    this.setState({
      updates: this.state.updates.map(
        other => other._id === update._id ?
          Object.assign({}, other, {
            bkptext: update.text,
            editable: true
          }) : other
      )
    });
  }

  handleTextChange(update, evt) {
    this.setState({
      updates: this.state.updates.map(
        other => other._id === update._id ?
          Object.assign({}, other, { text: evt.target.value }) : other
      )
    });
  }

  handleCancelEdit(update, evt) {
    evt.preventDefault();
    this.setState({
      updates: this.state.updates.map(
        other => other._id === update._id ?
          Object.assign({}, other, {
            text: update.bkptext,
            editable: false
          }) : other
      )
    });
  }

  handleSubmitEdit(update, evt) {
    evt.preventDefault();
    post(`${API_URL}/updates/${update._id}`, {
      text: update.text
    }).then(result => {
      this.setState({
        updates: this.state.updates.map(
          other => other._id === update._id ?
            Object.assign({}, other, { editable: false }) : other
        )
      });
    });
  }

  handleStartAdd(status) {
    const { author, updates, nextReportDate } = this.state;
    const update = {
      _id: Date.now(), author, reportDate: nextReportDate, status,
      text: '', resolved: false, editable: true, adding: true
    };
    this.setState({
      updates: updates.concat(update)
    });
  }

  handleCancelAdd(update, evt) {
    evt.preventDefault();
    this.setState({
      updates: this.state.updates.filter(
        other => other._id !== update._id
      )
    });
  }

  handleSubmitAdd(update, evt) {
    evt.preventDefault();
    post(`${API_URL}/updates`, makeUpdate(update)).then(
      resp => resp.json()
    ).then(
      created => this.setState({
        updates: this.state.updates.map(
          up => up._id === update._id ?
            makeUpdate(created) : up
        )
      })
    )
  }

  // used when an update is moved to another section
  handleResolve(update, status) {
    const body = {
      _id: update._id,
      status
    };

    switch (status) {
      case 'goal':
      case 'struggle':
      case 'achievement':
        body.reportDate = this.state.nextReportDate;
        break;
      case 'curgoal':
        body.status = 'goal';
        body.reportDate = this.state.prevReportDate;
        break;
      default:
        break;
    }

    post(`${API_URL}/resolve`, body).then(
      // XXX find a better way to get the newly created update?
      resp => resp.json()
    ).then(
      created => this.setState({
        updates: this.state.updates.map(
          up => up._id === update._id ?
            makeUpdate(created) : up
        )
      })
    )
  }

  // used when an update is removed from the page
  handleArchive(update, status) {
    const body = {
      _id: update._id,
      status
    };

    post(`${API_URL}/resolve`, body).then(
      () => this.setState({
        updates: this.state.updates.filter(
          other => other._id !== update._id
        )
      })
    );
  }

  render() {
    return (
      <Inbox
        author={this.state.author}
        prevReportDate={this.state.prevReportDate}
        nextReportDate={this.state.nextReportDate}
        nextReportSlug={this.state.nextReportSlug}

        inbox={this.state.updates.filter(up => up.status === 'inbox')}
        events={this.state.updates.filter(up => up.status === 'event')}

        prevgoals={this.state.updates.filter(
          up => up.status === 'goal' && up.reportDate < this.state.nextReportDate
        )}
        todo={this.state.updates.filter(up => up.status === 'todo')}
        done={this.state.updates.filter(up => up.status === 'done')}

        goals={this.state.updates.filter(
          up => up.status === 'goal' &&
            up.reportDate.getTime() === this.state.nextReportDate.getTime()
        )}
        struggles={this.state.updates.filter(up => up.status === 'struggle')}
        achievements={this.state.updates.filter(up => up.status === 'achievement')}

        handleTextChange={this.handleTextChange}

        handleStartEdit={this.handleStartEdit}
        handleCancelEdit={this.handleCancelEdit}
        handleSubmitEdit={this.handleSubmitEdit}

        handleStartAdd={this.handleStartAdd}
        handleCancelAdd={this.handleCancelAdd}
        handleSubmitAdd={this.handleSubmitAdd}

        handleResolve={this.handleResolve}
        handleArchive={this.handleArchive}
      />
    );
  }
}
