import React, { Component } from 'react';

import Review from './Review';
import { API_URL } from '../config';

function get(url) {
  return fetch(url).then(resp => resp.json());
}

function post(url, body) {
  return fetch(url, {
    method: 'POST',
    headers: new Headers({
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    }),
    body: JSON.stringify(body)
  });
}

export default class ReviewContainer extends Component {
  constructor(props) {
    super(props);
    this.state = {
      author: '',
      inbox: [],
      prevtodo: [],
      done: [],
      reportDate: new Date()
    };
    this.handleTriage = this.handleTriage.bind(this);
  }

  handleTriage(update, status, reportDate) {
    const prevstatus = update.status === 'inbox' ?
      'inbox' : `prev${update.status}`;

    post(`${API_URL}/updates/${update._id}`, {
      status, reportDate
    }).then(
      response => this.setState({
        [prevstatus]: this.state[prevstatus].filter(
          other => other._id !== update._id
        ),
        [status]: [...this.state[status], update]
      })
    )
  }

  componentDidMount() {
    const { author, year, month, day } = this.props.params;
    const report = `${year}-${month}-${day}`;
    Promise.all([
      get(`${API_URL}/updates?author=${author}&status=inbox`),
      get(`${API_URL}/updates?author=${author}&report=${report}&offset=1&status=todo`),
      get(`${API_URL}/updates?author=${author}&report=${report}&status=done`)
    ]).then(
      ([inbox, prevtodo, done]) => this.setState({
        author,
        reportDate: new Date(report),
        inbox,
        prevtodo,
        done
      })
    ).catch(
      () => console.log(this.state)
    );
  }

  render() {
    return (
      <Review
        author={this.state.author}
        reportDate={this.state.reportDate}

        inbox={this.state.inbox}
        prevtodo={this.state.prevtodo}
        done={this.state.done}

        handleTriage={this.handleTriage}
      />
    );
  }
}
