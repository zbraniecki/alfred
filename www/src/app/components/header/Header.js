import React from 'react';
import { Link } from 'react-router';

import { randElem } from '../../utils';
import { headerMessages } from '../../messages';

export default function Header(props) {
  const { name } = props;
  return (
    <header className="header">
      <Link to="/" className="logo logo--blue" />
      <h1 className="header__title">
        {`${randElem(headerMessages)}, ${name}`}
      </h1>
    </header>
  );
}
