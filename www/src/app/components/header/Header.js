import React from 'react';

import { randElem } from '../../utils';
import { headerMessages } from '../../messages';

export default function Header(props) {
  const { name } = props;
  return (
    <header className="header">
      <div className="logo logo--blue"></div>
      <h1 className="header__title">
        {`${randElem(headerMessages)}, ${name}`}
      </h1>
    </header>
  );
}
