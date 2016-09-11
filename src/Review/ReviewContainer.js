import React, { Component } from 'react';

import Review from './Review';
import { API_URL } from '../config';

export default class ReviewContainer extends Component {
  constructor(props) {
    super(props);
    this.state = {
      author: '',
      inbox: [],
      todos: [],
      done: [],
      struggles: [],
      reportDate: new Date()
    };
    this.handleTriage = this.handleTriage.bind(this);
  }

  handleTriage(update, status, reportDate) {
    fetch(`${API_URL}/updates/${update._id}`, {
      method: 'POST',
      headers: new Headers({
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      }),
      body: JSON.stringify({
        status, reportDate
      })
    }).then(
      response => this.setState({
        inbox: this.state.inbox.filter(other => other._id !== update._id),
        [status]: [...this.state[status], update]
      })
    )
  }

  componentDidMount() {
    const { author, year, month, day } = this.props.params;
    fetch(`${API_URL}/updates?author=${author}`).then(
      response => response.json()
    ).then(
      updates => this.setState({
        author,
        reportDate: new Date(`${year}-${month}-${day}`),
        inbox: updates
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
        todos={this.state.todos}
        done={this.state.done}
        struggles={this.state.struggles}

        handleTriage={this.handleTriage}
      />
    );
  }
}
