import React, { Component } from 'react';
import { connect } from 'react-redux';
import * as actions from '../actions';

import Inbox from '../components/inbox/Inbox';
import { API_URL } from '../../config';
import { makeUpdate, post } from '../utils';

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
    fetchCurrentReports().then(reports => {
      fetchUpdatesByAuthor(params.author, reports.nextReportSlug)
    });
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
    const { postUpdate } = this.props;
    evt.preventDefault();
    postUpdate({
      ...update,
      text: this.state.editText
    });
  }

  // used when an update is moved to another section
  handleResolve(update, status) {
    const { updates, inbox } = this.props;
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

    post(`${API_URL}/resolve`, body).then(
      // XXX find a better way to get the newly created update?
      resp => resp.json()
    ).then(
      created => this.setState({
        updates: updates.map(
          up => up._id === update._id ?
            makeUpdate(created) : up
        )
      })
    )
  }

  // used when an update is removed from the page
  handleArchive(update, status) {
    const { updates } = this.props;
    const body = {
      _id: update._id,
      status
    };

    post(`${API_URL}/resolve`, body).then(
      () => this.setState({
        updates: updates.filter(
          other => other._id !== update._id
        )
      })
    );
  }

  render() {
    const { updates, inbox } = this.props;
    return (
      <section>
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
            new Date(up.reportDate).getTime() === inbox.nextReportDate.getTime()
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
      </section>
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
  postUpdate: actions.postUpdate
};

export default connect(mapStateToProps, mapDispatchToProps)(InboxContainer);

