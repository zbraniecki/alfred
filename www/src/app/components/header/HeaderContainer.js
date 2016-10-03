import React, { Component } from 'react';

import Header from './Header';

export default class HeaderContainer extends Component {
  shouldComponentUpdate(nextProps) {
    return this.props.author !== nextProps.author;
  }

  render() {
    return (
      <Header name={this.props.author} />
    );
  }
}
