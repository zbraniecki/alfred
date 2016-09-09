import React, { Component } from 'react';

import Inbox from './Inbox';
import { API_URL } from './config';

export default class InboxContainer extends Component {
  constructor(props) {
    super(props);
    this.state = {
      author: '',
      updates: []
    };
  }

  componentDidMount() {
    const { author } = this.props.params;
    fetch(`${API_URL}/updates?author=${author}`).then(
      response => response.json()
    ).then(
      updates => this.setState({author, updates})
    );
  }

  render() {
    return (
      <Inbox
        author={this.state.author}
        updates={this.state.updates}
      />
    );
  }
}
