import React, { Component } from 'react';
import { connect } from 'react-redux';
import * as actions from '../actions';

import Inbox from '../components/inbox/Inbox';
import { API_URL } from '../../config';
import { makeUpdate, post } from '../utils';

class InboxContainer extends Component {
  constructor(props) {
    super(props);

    this.state = {
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

  componentWillMount() {
    const { params, setAuthor } = this.props;
    const { fetchUpdatesByAuthor } = this.props;

    setAuthor(params.author);
    fetchUpdatesByAuthor(params.author);
  }

  handleStartEdit(update) {
    const { updates } = this.props;
    this.setState({
      updates: updates.map(
        other => other._id === update._id ?
          Object.assign({}, other, {
            bkptext: update.text,
            editable: true
          }) : other
      )
    });
  }

  handleTextChange(update, evt) {
    const { updates } = this.props;
    this.setState({
      updates: updates.map(
        other => other._id === update._id ?
          Object.assign({}, other, { text: evt.target.value }) : other
      )
    });
  }

  handleCancelEdit(update, evt) {
    const { updates } = this.props;
    evt.preventDefault();
    this.setState({
      updates: updates.map(
        other => other._id === update._id ?
          Object.assign({}, other, {
            text: update.bkptext,
            editable: false
          }) : other
      )
    });
  }

  handleSubmitEdit(update, evt) {
    const { updates } = this.props;
    evt.preventDefault();
    post(`${API_URL}/updates/${update._id}`, {
      text: update.text
    }).then(result => {
      this.setState({
        updates: updates.map(
          other => other._id === update._id ?
            Object.assign({}, other, { editable: false }) : other
        )
      });
    });
  }

  handleStartAdd(status) {
    const { nextReportDate } = this.state;
    const { author, updates } = this.props;
    const update = {
      _id: Date.now(), author, reportDate: nextReportDate, status,
      text: '', resolved: false, editable: true, adding: true
    };
    this.setState({
      updates: updates.concat(update)
    });
  }

  handleCancelAdd(update, evt) {
    const { updates } = this.props;
    evt.preventDefault();
    this.setState({
      updates: updates.filter(
        other => other._id !== update._id
      )
    });
  }

  handleSubmitAdd(update, evt) {
    const { updates } = this.props;
    evt.preventDefault();
    post(`${API_URL}/updates`, makeUpdate(update)).then(
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

  // used when an update is moved to another section
  handleResolve(update, status) {
    const { updates } = this.props;
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
    const { postReport, updates, author } = this.props;
    return (
      <section>
      <button onClick={postReport}>post report</button>
      <Inbox
        author={author}
        prevReportDate={this.state.prevReportDate}
        nextReportDate={this.state.nextReportDate}
        nextReportSlug={this.state.nextReportSlug}

        inbox={updates.filter(up => up.status === 'inbox')}
        events={updates.filter(up => up.status === 'event')}

        prevgoals={updates.filter(
          up => up.status === 'goal' && up.reportDate < this.state.nextReportDate
        )}
        todo={updates.filter(up => up.status === 'todo')}
        done={updates.filter(up => up.status === 'done')}

        goals={updates.filter(
          up => up.status === 'goal' &&
            up.reportDate.getTime() === this.state.nextReportDate.getTime()
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

const mapStateToProps = (state) => {
  return {
    author: state.user.author,
    updates: state.updates.inbox
  };
}

const mapDispatchToProps = {
  fetchUpdatesByAuthor: actions.fetchUpdatesByAuthor,
  setAuthor: actions.setAuthor
};

export default connect(mapStateToProps, mapDispatchToProps)(InboxContainer);

