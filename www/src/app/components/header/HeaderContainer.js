import React, { Component } from 'react';

import Header from './Header';

export default class HeaderContainer extends Component {
  shouldComponentUpdate() {
    return false;
  }

  render() {
    return (
      <Header name={this.props.author} />
    );
  }
}
