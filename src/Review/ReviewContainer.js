import React, { Component } from 'react';

import Review from './Review';
import { API_URL } from '../config';

export default class ReviewContainer extends Component {
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
      <Review
        author={this.state.author}
        updates={this.state.updates}
      />
    );
  }
}
