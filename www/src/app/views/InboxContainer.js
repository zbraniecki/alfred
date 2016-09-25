import React, { Component } from 'react';

import Inbox from '../components/inbox/Inbox';
import { API_URL } from '../../config';
import { makeUpdate, get, post } from '../utils';

export default class InboxContainer extends Component {
  constructor(props) {
    super(props);

    const { author, year, month, day } = this.props.params;
    const report = `${year}-${month}-${day}`;

    this.state = {
      author,
      updates: [],
      report,
      reportDate: new Date(report)
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
    const { author, report } = this.state;
    const updatesByAuthor = `${API_URL}/updates?author=${author}`;
    Promise.all([
      get(`${updatesByAuthor}&resolved=0&status=inbox&status=todo&status=done`),
      get(`${updatesByAuthor}&resolved=0&status=goal&before=${report}`),
      get(`${updatesByAuthor}&report=${report}&status=goal&status=struggle&status=achievement`),
    ]).then(
      ([current, prev, next]) => this.setState({
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
    const { author, updates, reportDate } = this.state;
    const update = {
      _id: Date.now(), author, reportDate, status,
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

  handleResolve(update, status, reportDate) {
    post(`${API_URL}/resolve`, {
      _id: update._id, status, reportDate
    }).then(
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

  handleArchive(update) {
    post(`${API_URL}/updates/${update._id}`, {
      resolved: true,
      // XXX set resolveDate on the server
      resolveDate: new Date()
    }).then(result => {
      this.setState({
        updates: this.state.updates.filter(
          other => other._id !== update._id
        )
      });
    });
  }

  render() {
    return (
      <Inbox
        author={this.state.author}
        report={this.state.report}
        reportDate={this.state.reportDate}

        inbox={this.state.updates.filter(up => up.status === 'inbox')}

        prevgoals={this.state.updates.filter(
          up => up.status === 'goal' && up.reportDate < this.state.reportDate
        )}
        todo={this.state.updates.filter(up => up.status === 'todo')}
        done={this.state.updates.filter(up => up.status === 'done')}

        goals={this.state.updates.filter(
          up => up.status === 'goal' &&
            up.reportDate.getTime() === this.state.reportDate.getTime()
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
