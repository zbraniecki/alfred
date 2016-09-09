import React, { Component } from 'react';

import Inbox from './Inbox';

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
    fetch(`http://localhost:4001/updates?author=${author}`).then(
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
