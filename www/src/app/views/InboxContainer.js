import React, { Component } from 'react';
import { connect } from 'react-redux';
import * as actions from '../actions';

import Inbox from '../components/inbox/Inbox';

class InboxContainer extends Component {
  constructor(props) {
    super(props);

    this.handleTextChange = this.handleTextChange.bind(this);

    this.handleStartEdit = this.handleStartEdit.bind(this);
    this.handleCancelEdit = this.handleCancelEdit.bind(this);
    this.handleSubmitEdit = this.handleSubmitEdit.bind(this);

    this.handleStartAdd = this.handleStartAdd.bind(this);
    this.handleCancelAdd = this.handleCancelAdd.bind(this);
    this.handleSubmitAdd = this.handleSubmitAdd.bind(this);

    this.handleResolve = this.handleResolve.bind(this);
    this.handleArchive = this.handleArchive.bind(this);

    this.state = {
      editText: '',
      updates: []
    };
  }

  componentWillMount() {
    const { params, setAuthor } = this.props;
    const { fetchCurrentReports, fetchUpdatesByAuthor } = this.props;

    setAuthor(params.author);
    fetchCurrentReports().then(
      reports => fetchUpdatesByAuthor(params.author, reports.nextReportSlug)
    );
  }

  handleStartEdit(update) {
    const { setEditing } = this.props;
    setEditing(update);
    this.setState({
      editText: update.text
    });
  }

  handleTextChange(evt) {
    this.setState({
      editText: evt.target.value
    });
  }

  handleCancelEdit(update, evt) {
    const { cancelEditing } = this.props;
    cancelEditing(update);
  }

  handleSubmitEdit(update, evt) {
    const { patchUpdate } = this.props;
    evt.preventDefault();
    patchUpdate({
      ...update,
      text: this.state.editText
    });
  }

  handleStartAdd(status) {
    const { startAdd } = this.props;
    startAdd(status);
  }

  handleCancelAdd(update, evt) {
    const { cancelAdd } = this.props;
    evt.preventDefault();
    cancelAdd(update);
  }

  handleSubmitAdd(update, evt) {
    const { createUpdate } = this.props;
    evt.preventDefault();
    createUpdate({
      ...update,
      text: this.state.editText
    });
  }

  // used when an update is moved to another section
  handleResolve(update, status) {
    const { inbox, resolveUpdate } = this.props;
    const body = {
      _id: update._id,
      status
    };

    switch (status) {
      case 'goal':
      case 'struggle':
      case 'achievement':
        body.reportDate = inbox.nextReportDate;
        break;
      case 'curgoal':
        body.status = 'goal';
        body.reportDate = inbox.prevReportDate;
        break;
      default:
        break;
    }

    resolveUpdate(body);
  }

  // used when an update is removed from the page
  handleArchive(update, status) {
    const { resolveUpdate } = this.props;
    const body = {
      _id: update._id,
      status
    };

    resolveUpdate(body);
  }

  render() {
    const { updates, inbox } = this.props;
    return (
      <Inbox
        author={inbox.author}
        nextReportDate={inbox.nextReportDate}
        nextReportSlug={inbox.nextReportSlug}

        inbox={updates.filter(up => up.status === 'inbox')}
        events={updates.filter(up => up.status === 'event')}

        prevgoals={updates.filter(
          up => up.status === 'goal' && up.reportDate < inbox.nextReportDate
        )}
        todo={updates.filter(up => up.status === 'todo')}
        done={updates.filter(up => up.status === 'done')}

        goals={updates.filter(
          up => up.status === 'goal' &&
            up.reportDate.getTime() === inbox.nextReportDate.getTime()
        )}
        struggles={updates.filter(up => up.status === 'struggle')}
        achievements={updates.filter(up => up.status === 'achievement')}

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

const mapStateToProps = (state) => ({
  inbox: state.inbox,
  updates: state.inbox.updates
});

const mapDispatchToProps = {
  fetchCurrentReports: actions.fetchCurrentReports,
  fetchUpdatesByAuthor: actions.fetchUpdatesByAuthor,
  patchUpdate: actions.patchUpdate,
  setAuthor: actions.setAuthor,
  setEditing: actions.setEditing,
  cancelEditing: actions.cancelEditing,
  startAdd: actions.startAdd,
  cancelAdd: actions.cancelAdd,
  createUpdate: actions.createUpdate,
  resolveUpdate: actions.resolveUpdate
};

export default connect(mapStateToProps, mapDispatchToProps)(InboxContainer);

