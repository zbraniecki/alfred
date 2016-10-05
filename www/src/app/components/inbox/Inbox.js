import React from 'react';

import Board from './Board';
import Loading from '../loading/Loading';
import HeaderContainer from '../header/HeaderContainer';

export default function Inbox(props) {
  const content = props.isFetching ?
    <Loading /> :
    <Board {...props} />;

  return (
    <div>
      <HeaderContainer
        author={props.author}
      />
      {content}
    </div>
  );
}

