import React, { Component } from 'react';

import Review from './Review';
import { API_URL } from '../config';
import { get, post } from '../utils';

export default class ReviewContainer extends Component {
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

    this.handleStartEdit = this.handleStartEdit.bind(this);
    this.handleTextChange = this.handleTextChange.bind(this);
    this.handleSubmitEdit = this.handleSubmitEdit.bind(this);
    this.handleResolve = this.handleResolve.bind(this);
  }

  componentDidMount() {
    const { author, report } = this.state;
    const updatesByAuthor = `${API_URL}/updates?author=${author}`;
    Promise.all([
      get(`${updatesByAuthor}&resolved=0&status=inbox`),
      get(`${updatesByAuthor}&resolved=0&status=todo&before=${report}`),
      get(`${updatesByAuthor}&report=${report}&status=done&status=todo&status=struggle`),
    ]).then(
      ([inbox, prevtodo, current]) => this.setState({
        updates: [...inbox, ...prevtodo, ...current].map(
          up => Object.assign(up, {
            reportDate: new Date(up.reportDate)
          })
        )
      })
    ).catch(
      () => console.log(this.state)
    );
  }

  handleStartEdit(update) {
    this.setState({
      updates: this.state.updates.map(
        other => other._id === update._id ?
          Object.assign({}, other, { editable: true }) : other
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
            Object.assign({}, created, {
              reportDate: new Date(created.reportDate)
            }) : up
        )
      })
    )
  }

  render() {
    return (
      <Review
        author={this.state.author}
        reportDate={this.state.reportDate}

        inbox={this.state.updates.filter(up => up.status === 'inbox')}
        prevtodo={this.state.updates.filter(
          up => up.status === 'todo' && up.reportDate < this.state.reportDate
        )}
        done={this.state.updates.filter(up => up.status === 'done')}
        todo={this.state.updates.filter(
          up => up.status === 'todo' &&
            up.reportDate.getTime() === this.state.reportDate.getTime()
        )}
        struggle={this.state.updates.filter(up => up.status === 'struggle')}

        handleStartEdit={this.handleStartEdit}
        handleTextChange={this.handleTextChange}
        handleSubmitEdit={this.handleSubmitEdit}
        handleResolve={this.handleResolve}
      />
    );
  }
}
